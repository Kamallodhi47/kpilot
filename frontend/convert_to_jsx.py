import re

html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract the landing page content
start = html.find('<div id="landing-page-content">')
# find closing </div> of landing-page-content. It's the div right before <div id="root">
end = html.find('<div id="root"></div>')
if start != -1 and end != -1:
    landing_html = html[start + 31:end].strip() # inside the wrapper
else:
    print("Could not find landing page content")
    exit(1)

# Basic HTML to JSX conversions
jsx = landing_html

# 1. class -> className
jsx = re.sub(r'\bclass=', 'className=', jsx)

# 2. for -> htmlFor (if any)
jsx = re.sub(r'\bfor=', 'htmlFor=', jsx)

# 3. inline styles. <div style="display:inline-flex;gap:10px"> -> <div style={{display: 'inline-flex', gap: '10px'}}>
def style_to_jsx(match):
    style_str = match.group(1)
    if not style_str.strip():
        return 'style={{}}'
    
    parts = style_str.split(';')
    jsx_style = []
    for p in parts:
        if ':' not in p: continue
        k, v = p.split(':', 1)
        k = k.strip()
        v = v.strip()
        # convert kebab-case to camelCase except for CSS variables
        if k.startswith('--'):
            pass
        else:
            k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            
        jsx_style.append(f"'{k}': '{v}'")
    
    return "style={{" + ", ".join(jsx_style) + "}}"

jsx = re.sub(r'style="([^"]*)"', style_to_jsx, jsx)
jsx = re.sub(r"style='([^']*)'", style_to_jsx, jsx)

# 4. Self-close void elements: img, br, hr, input, source, track, path, defs, stop, canvas
void_elements = ['img', 'br', 'hr', 'input', 'source', 'track']
for el in void_elements:
    jsx = re.sub(fr'<{el}([^>]*?)(?<!/)>', fr'<{el}\1 />', jsx)

# Handle <path> and <stop> which are sometimes not closed properly in random HTML, though usually they have closing tags.
# In SVG, path and stop can be self-closing
jsx = re.sub(r'<(path|stop|use|rect|circle|line|polygon|polyline)([^>]*?)(?<!/)>', r'<\1\2 />', jsx)
# Remove closing tags for those if they existed
jsx = re.sub(r'</(path|stop|use|rect|circle|line|polygon|polyline)>', '', jsx)


# 5. Some attributes like xmlns:xlink become xmlnsXlink, stroke-width -> strokeWidth, etc for SVGs
svg_attrs = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stop-color': 'stopColor',
    'stroke-miterlimit': 'strokeMiterlimit',
    'xml:space': 'xmlSpace',
    'xmlns:xlink': 'xmlnsXlink',
    'clip-path': 'clipPath',
    'viewBox': 'viewBox',
    'preserveAspectRatio': 'preserveAspectRatio',
    'aria-hidden': 'aria-hidden',
    'aria-label': 'aria-label',
    'data-theme': 'data-theme',
}
for k, v in svg_attrs.items():
    jsx = jsx.replace(f'{k}=', f'{v}=')
    
jsx = jsx.replace('autoplay=""', 'autoPlay')
jsx = jsx.replace('loop=""', 'loop')
jsx = jsx.replace('muted=""', 'muted')
jsx = jsx.replace('playsinline=""', 'playsInline')
jsx = jsx.replace('data-magnet=""', 'data-magnet="true"')

# Finally wrap in a React Component
jsx_component = """import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  useEffect(() => {
    // Scroll animation logic
    const track = document.getElementById('features');
    const title = track?.querySelector('.hz-title');
    const cardsWrap = track?.querySelector('.hz-cards');
    const cards = track?.querySelectorAll('.hz-card.workflow-step');

    if (track && title && cardsWrap && cards) {
      const handleScroll = () => {
        const rect = track.getBoundingClientRect();
        const scrollDistance = track.offsetHeight - window.innerHeight;
        let progress = 0;
        
        if (scrollDistance > 0) {
           progress = -rect.top / scrollDistance;
        }
        
        progress = Math.max(0, Math.min(1, progress));
        
        (title as HTMLElement).style.setProperty('--title-progress', progress.toString());
        (cardsWrap as HTMLElement).style.setProperty('--workflow-progress', progress.toString());
        
        cards.forEach((card, i) => {
           const start = 0.2 + (i * 0.15);
           const end = start + 0.15;
           let cardP = (progress - start) / (end - start);
           cardP = Math.max(0, Math.min(1, cardP));
           (card as HTMLElement).style.setProperty('--card-progress', cardP.toString());
           if (cardP > 0.5) {
              card.classList.add('is-lit');
           } else {
              card.classList.remove('is-lit');
           }
        });
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    // Reveal animation logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0
    });
    
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .agent-reveal-left, .agent-reveal-right, .stat-card, .audience-card'
    );
    
    revealElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div id="landing-page-content">
      """ + jsx + """
    </div>
  );
}
"""

with open('c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(jsx_component)

# Now we must remove this chunk from index.html
new_html = html[:start] + html[end:]
# Also remove the injected scripts since they are now in the useEffect!
new_html = re.sub(r'<script>\s*window\.addEventListener\(\'DOMContentLoaded\', \(\) => \{\s*const track = document\.getElementById.*?\}\);\s*</script>', '', new_html, flags=re.DOTALL)
new_html = re.sub(r'<script>\s*window\.addEventListener\(\'DOMContentLoaded\', \(\) => \{\s*const observer = new IntersectionObserver.*?\}\);\s*</script>', '', new_html, flags=re.DOTALL)
new_html = re.sub(r'<script>\s*window\.addEventListener\(\'DOMContentLoaded\', \(\) => \{\s*const loginLinks.*?\}\);\s*</script>', '', new_html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Converted successfully to React component!")

import re

html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the custom cursor script
html = re.sub(r'<script>\s*setTimeout\(\(\) => \{\s*const dot = document\.querySelector\(\'\.cursor-dot\'\);.*?\}\s*\}, 100\);\s*</script>', '', html, flags=re.DOTALL)

# Remove the cursor DOM elements
html = re.sub(r'<div class="cursor-ring".*?<div class="cursor-emoji"[^>]*></div>', '', html, flags=re.DOTALL)

# Make sure to remove `cursor-active` class from HTML tag so that any CSS doesn't hide it
html = html.replace('class="cursor-active"', '')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

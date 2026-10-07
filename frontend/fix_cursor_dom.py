import re

html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# The elements are something like:
# <div class="cursor-ring" aria-hidden="true" style="..."></div><div class="cursor-dot" aria-hidden="true" style="..."></div><div class="cursor-emoji" aria-hidden="true"></div>
match = re.search(r'<div class="cursor-ring".*?<div class="cursor-emoji"[^>]*></div>', html)
if match:
    cursor_html = match.group(0)
    # Remove it from current location
    html = html.replace(cursor_html, '')
    # Insert it right before <script type="module" src="/src/main.tsx"></script>
    html = html.replace('<script type="module" src="/src/main.tsx"></script>', cursor_html + '\n<script type="module" src="/src/main.tsx"></script>')

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed!")
else:
    print("Not found")

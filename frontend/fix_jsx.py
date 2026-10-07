import re

jsx_path = 'c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

# Replace HTML comments
jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx)

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

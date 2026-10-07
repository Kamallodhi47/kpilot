jsx_path = 'c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

import re

def fix_link(match):
    full_tag = match.group(0)
    # Extract only the text content
    inner_html = re.sub(r'<[^>]+>', '', full_tag)
    if "login" not in inner_html.lower():
        return full_tag.replace('href="/login"', 'href="#"')
    return full_tag

jsx = re.sub(r'<a[^>]*href="/login"[^>]*>.*?</a>', fix_link, jsx, flags=re.DOTALL|re.IGNORECASE)

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

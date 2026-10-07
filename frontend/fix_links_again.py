jsx_path = 'c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

# We need to find all <a ... href="/login" ... >...</a>
# If the inner text does not contain "Login" or "login", revert it to href="#"
import re

def fix_link(match):
    full_tag = match.group(0)
    # Check if "Login" is in the inner text or anywhere in the tag's inner HTML
    if "Login" not in full_tag and "login" not in full_tag:
        # Revert to #
        return full_tag.replace('href="/login"', 'href="#"')
    return full_tag

# Regex to match <a> tags with href="/login"
jsx = re.sub(r'<a[^>]*href="/login"[^>]*>.*?</a>', fix_link, jsx, flags=re.DOTALL|re.IGNORECASE)

# What about Link components? If they were converted to Link (probably not, they are still <a> tags)
with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

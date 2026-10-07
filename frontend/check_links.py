import re
jsx = open('c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx', 'r', encoding='utf-8').read()
matches = re.finditer(r'<a[^>]*href="/login"[^>]*>.*?</a>', jsx, re.DOTALL | re.IGNORECASE)
for m in matches:
    print(m.group(0))

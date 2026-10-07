import re

jsx_path = 'c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

# Remove all <script>...</script> tags
jsx = re.sub(r'<script[^>]*>.*?</script>', '', jsx, flags=re.DOTALL)

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

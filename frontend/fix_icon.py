import re

jsx_path = 'c:/Users/dell/meta/frontend/src/pages/Dashboard.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = jsx.replace('Facebook, ', '')
jsx = jsx.replace('<Facebook className="w-4 h-4" />', '')

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

jsx_path = 'c:/Users/dell/meta/frontend/src/pages/Login.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

jsx = jsx.replace("navigate('/dashboard');", "navigate('/home');")

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

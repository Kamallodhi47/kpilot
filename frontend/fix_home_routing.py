import re

# 1. Update App.tsx
app_path = 'c:/Users/dell/meta/frontend/src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app = f.read()

app = app.replace("import LandingPage from './pages/LandingPage';", "import LandingPage from './pages/LandingPage';\nimport Home from './pages/Home';")
app = app.replace('<Route path="/dashboard" element={<Dashboard />} />', '<Route path="/home" element={<Home />} />\n          <Route path="/dashboard" element={<Dashboard />} />')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app)

# 2. Update MainLayout.tsx
layout_path = 'c:/Users/dell/meta/frontend/src/layouts/MainLayout.tsx'
with open(layout_path, 'r', encoding='utf-8') as f:
    layout = f.read()

layout = layout.replace("{ name: 'Home', href: '/', icon: Home },", "{ name: 'Home', href: '/home', icon: Home },")
# Change active check back to startsWith for /home, or just exact match
layout = layout.replace("const isActive = item.href === '/' \n                ? location.pathname === '/' \n                : location.pathname.startsWith(item.href);", "const isActive = item.href === '/home' ? location.pathname === '/home' : location.pathname.startsWith(item.href);")

with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout)

layout_path = 'c:/Users/dell/meta/frontend/src/layouts/MainLayout.tsx'
with open(layout_path, 'r', encoding='utf-8') as f:
    layout = f.read()

# Replace padding div with conditional padding
import re
layout = re.sub(
    r'<div className="p-4 sm:p-6 md:p-8">.*?<Outlet />.*?</div>', 
    '<div className={location.pathname === "/build" ? "h-full w-full" : "p-4 sm:p-6 md:p-8 h-full"}>\n            <Outlet />\n          </div>',
    layout, flags=re.DOTALL
)

with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout)

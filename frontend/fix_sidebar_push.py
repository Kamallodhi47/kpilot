path = 'c:/Users/dell/meta/frontend/src/layouts/MainLayout.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sidebar part of flex flow (remove fixed and top/left)
content = content.replace(
    'fixed left-0 top-0 w-[76px] hover:w-64 group overflow-hidden shadow-2xl', 
    'w-[76px] hover:w-64 group overflow-hidden shadow-2xl shrink-0'
)

# Remove the static left margin from main content
content = content.replace(
    'flex flex-col flex-1 w-0 overflow-hidden bg-[#0f0f13] md:ml-[76px]',
    'flex flex-col flex-1 w-0 overflow-hidden bg-[#0f0f13] transition-all duration-300'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

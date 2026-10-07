path = 'c:/Users/dell/meta/frontend/src/pages/CampaignBuilder.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(
    r'<div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">\s*<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>\s*</div>',
    '',
    code,
    flags=re.DOTALL
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

jsx_path = 'c:/Users/dell/meta/frontend/src/pages/LandingPage.tsx'
with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx = f.read()

# Replace the last </div> with nothing.
# Wait, the end is:
# </div>
#     </div>
#   );
# }
import re
jsx = re.sub(r'</div>\s*</div>\s*\);\s*\}', r'</div>\n  );\n}', jsx)

with open(jsx_path, 'w', encoding='utf-8') as f:
    f.write(jsx)

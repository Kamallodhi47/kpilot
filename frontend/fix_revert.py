html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# We can't simply revert href="/login" back to href="#" because legitimate login links are now href="/login".
# But wait, did the user actually click it and it didn't work before my previous fix?
# Yes! My `fix_spa_link.py` intercepted clicks to `/login`. So any `href="/login"` now triggers React Router seamlessly!

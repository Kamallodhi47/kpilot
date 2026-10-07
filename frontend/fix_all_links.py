html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace any lingering login links
html = html.replace('href="https://app.nyx.today/apphome/login"', 'href="/login"')
html = html.replace('href="https://app.nyx.today"', 'href="/login"')
html = html.replace('href="#"', 'href="/login"')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

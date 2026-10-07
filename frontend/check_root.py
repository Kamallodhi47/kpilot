html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()
idx = html.find('id="root"')
print(html[max(0, idx-100):idx+100])

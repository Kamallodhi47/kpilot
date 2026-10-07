import re

html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Clean the mangled DOCTYPE and the incorrectly placed <div id="landing-page-content">
html = html.replace("<!DOC\n<div id=\"landing-page-content\">\nTYPE html>", "<!DOCTYPE html>")

# 2. Re-insert <div id="landing-page-content"> after <body style="">
# Check if it's already there (just in case I did it somewhere else too)
if '<div id="landing-page-content">' not in html:
    html = re.sub(r'(<body[^>]*>)', r'\1\n<div id="landing-page-content">\n', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

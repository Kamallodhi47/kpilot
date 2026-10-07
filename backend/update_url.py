import codecs
content = codecs.open('main.py', 'r', encoding='utf-8').read()

old_url_code = 'url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}"'
new_url_code = 'url = f"https://www.facebook.com/v18.0/dialog/oauth?client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}&config_id=941255918608952"'

content = content.replace(old_url_code, new_url_code)
codecs.open('main.py', 'w', encoding='utf-8').write(content)
print('done')

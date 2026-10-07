import codecs
content = codecs.open('src/App.tsx', 'r', encoding='utf-8').read()
content = content.replace("import Onboarding from './pages/Onboarding';", "import Onboarding from './pages/Onboarding';\nimport MetaCallback from './pages/MetaCallback';")
content = content.replace("<Route path=\"/onboarding\" element={<Onboarding />} />", "<Route path=\"/onboarding\" element={<Onboarding />} />\n        <Route path=\"/meta/callback\" element={<MetaCallback />} />")
codecs.open('src/App.tsx', 'w', encoding='utf-8').write(content)
print('done')

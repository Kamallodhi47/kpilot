import re

app_path = 'c:/Users/dell/meta/frontend/src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app = f.read()

# Remove /build from inside MainLayout
app = app.replace('<Route path="/build" element={<CampaignBuilder />} />', '')

# Add /build outside MainLayout, above it
app = app.replace('<Route element={<MainLayout />}>', '<Route path="/build" element={<CampaignBuilder />} />\n        <Route element={<MainLayout />}>')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app)

app_path = 'c:/Users/dell/meta/frontend/src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app = f.read()

# Remove /build from outside MainLayout
app = app.replace('<Route path="/build" element={<CampaignBuilder />} />\n        <Route element={<MainLayout />}>', '<Route element={<MainLayout />}>')

# Add /build inside MainLayout
app = app.replace('<Route path="/home" element={<Home />} />', '<Route path="/home" element={<Home />} />\n          <Route path="/build" element={<CampaignBuilder />} />')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app)

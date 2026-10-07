import re
app_path = 'c:/Users/dell/meta/frontend/src/App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Instead of hiding only on unmount, we should forcefully hide it if we are not on the landing page
# Actually, the best place to handle this is in the React root or App component.
# Let's update App.tsx to handle this globally.

new_app_code = """
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CampaignBuilder from './pages/CampaignBuilder';
import AIProcessing from './pages/AIProcessing';
import Login from './pages/Login';

function GlobalRouteHandler() {
  const location = useLocation();
  useEffect(() => {
    const el = document.getElementById('landing-page-content');
    if (el) {
      if (location.pathname === '/') {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <GlobalRouteHandler />
      <Routes>
        {/* We don't need a specific LandingPage component anymore, the GlobalRouteHandler handles the HTML visibility */}
        <Route path="/" element={null} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/build" element={<CampaignBuilder />} />
          <Route path="/processing" element={<AIProcessing />} />
          <Route path="/settings" element={<div className="text-white text-2xl font-bold">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
"""

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(new_app_code)

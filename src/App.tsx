import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CampaignBuilder from './pages/CampaignBuilder';
import AIProcessing from './pages/AIProcessing';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/build" element={<CampaignBuilder />} />
          <Route path="/processing" element={<AIProcessing />} />
          {/* Settings placeholder */}
          <Route path="/settings" element={<div className="text-white text-2xl font-bold">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

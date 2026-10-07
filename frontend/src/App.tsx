import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CampaignBuilder from './pages/CampaignBuilder';
import AIProcessing from './pages/AIProcessing';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import MetaCallback from './pages/MetaCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/build" element={<CampaignBuilder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/processing" element={<AIProcessing />} />
          <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/meta/callback" element={<MetaCallback />} />
          <Route path="/settings" element={<div className="text-white text-2xl font-bold">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

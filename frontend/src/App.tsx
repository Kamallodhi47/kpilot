import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CampaignBuilder from './pages/CampaignBuilder';
import AIProcessing from './pages/AIProcessing';
import Pixeo from './pages/Pixeo';
import Neo from './pages/Neo';
import Assets from './pages/Assets';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import MetaCallback from './pages/MetaCallback';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/build" element={<CampaignBuilder />} />
            <Route path="/xeno" element={<CampaignBuilder />} />
            <Route path="/pixeo" element={<Pixeo />} />
            <Route path="/neo" element={<Neo />} />
            <Route path="/analytics" element={<Neo />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/campulse" element={<Dashboard defaultTab="campaigns" />} />
            <Route path="/dashboard" element={<Dashboard defaultTab="overview" />} />
            <Route path="/optimise" element={<Dashboard defaultTab="recommendation" />} />
            <Route path="/recommendation" element={<Dashboard defaultTab="recommendation" />} />
            <Route path="/processing" element={<Pixeo />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/meta/callback" element={<MetaCallback />} />
            <Route path="/settings" element={<div className="text-white text-2xl font-bold">Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

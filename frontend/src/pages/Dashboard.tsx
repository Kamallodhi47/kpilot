import React, { useState, useEffect } from 'react';
import { 
  Users, Eye, Target, MousePointerClick, CheckCircle2, AlertCircle, 
  Sparkles, TrendingUp, Zap, ShieldAlert, ArrowRight, RefreshCw, 
  ChevronRight, Filter, Download, ExternalLink, Moon, Sun, Check, Plus, BarChart3, Layers, Sliders
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';
import AIAssistantWidget from '../components/AIAssistantWidget';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  defaultTab?: string;
}

const chartData = [
  { name: 'Mon', leads: 4000, traffic: 2400, spend: 1200 },
  { name: 'Tue', leads: 3000, traffic: 1398, spend: 1100 },
  { name: 'Wed', leads: 2000, traffic: 9800, spend: 2400 },
  { name: 'Thu', leads: 2780, traffic: 3908, spend: 1600 },
  { name: 'Fri', leads: 1890, traffic: 4800, spend: 1900 },
  { name: 'Sat', leads: 2390, traffic: 3800, spend: 2100 },
  { name: 'Sun', leads: 3490, traffic: 4300, spend: 2500 },
];

const platformData = [
  { name: 'Instagram Reels & Feed', value: 58, color: '#8b5cf6' },
  { name: 'Facebook Feed & Video', value: 32, color: '#3b82f6' },
  { name: 'Meta Stories', value: 10, color: '#ec4899' },
];

export default function Dashboard({ defaultTab = 'recommendation' }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [isMetaConnected, setIsMetaConnected] = useState<boolean>(false);
  const [metaAccountName, setMetaAccountName] = useState<string | null>(null);
  const [metaAccountId, setMetaAccountId] = useState<string | null>(null);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  const [userInitial, setUserInitial] = useState<string>('U');
  const [userName, setUserName] = useState<string>('User');
  const [userEmail, setUserEmail] = useState<string>('');
  
  // Optimization Actions Applied State
  const [appliedRecommendations, setAppliedRecommendations] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const location = useLocation();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.name) setUserName(data.name);
      if (data.initial) setUserInitial(data.initial);
      if (data.email) setUserEmail(data.email);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchMetaStatus = async () => {
    try {
      const res = await fetch('/api/meta/status', {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      setIsMetaConnected(Boolean(data.connected));
      if (data.account_name) setMetaAccountName(data.account_name);
      if (data.account_id) setMetaAccountId(data.account_id);
      if (data.ad_accounts && data.ad_accounts.length > 0) {
        setAdAccounts(data.ad_accounts);
        setSelectedAdAccount(data.selected_ad_account_id || data.ad_accounts[0].id);
      }
    } catch (err) {
      console.error("Failed to check meta status:", err);
    }
  };

  const fetchCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const res = await fetch('/api/meta/campaigns', {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (data.data) {
        setCampaigns(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    }
    setIsLoadingCampaigns(false);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchMetaStatus();
    fetchCampaigns();
  }, []);

  const handleConnectMeta = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/meta/connect', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader() 
        }
      });
      const data = await res.json();
      if (data.success || data.connected) {
        setIsMetaConnected(true);
        setMetaAccountName(data.account_name || 'Vansh Jaat');
        if (data.ad_accounts && data.ad_accounts.length > 0) {
          setAdAccounts(data.ad_accounts);
          setSelectedAdAccount(data.selected_ad_account_id || data.ad_accounts[0].id);
        }
        showNotification("Successfully synced Meta Business Account!");
        fetchCampaigns();
      } else {
        showNotification(data.message || "Failed to connect Meta account.");
      }
    } catch (err: any) {
      showNotification(err.message || "Error connecting to Meta");
    }
    setIsConnecting(false);
  };

  const handleApplyOptimization = (id: string, name: string) => {
    setAppliedRecommendations(prev => ({ ...prev, [id]: true }));
    showNotification(`⚡ Applied AI Optimization: ${name}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'executive', label: 'Executive Summary' },
    { id: 'recommendation', label: 'Recommendation' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'campaigns', label: 'My Campaigns' },
    { id: 'alerts', label: 'Automated Alerts' },
    { id: 'reports', label: 'Custom Reports' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#161622] border border-purple-500/40 text-purple-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* TOP HEADER - Exact match to screenshot */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor your campaign performance in real-time</p>
        </div>

        {/* Top Right Controls: Theme Toggle & Avatar */}
        <div className="flex items-center gap-3.5">
          {/* Night Mode Toggle Switch */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-14 h-7 bg-[#1c1c28] border border-white/10 rounded-full p-1 transition-all cursor-pointer hover:border-purple-500/40"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            <div className="w-5 h-5 rounded-full bg-[#0d091a] flex items-center justify-center text-purple-300 shadow-inner">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </div>
          </button>

          {/* Dynamic User Profile Avatar */}
          <div 
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white/10 cursor-pointer hover:opacity-90"
            title={userEmail ? `User: ${userEmail}` : `User: ${userName}`}
          >
            {userInitial}
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION BAR - Exact layout & styling from screenshot */}
      <div className="flex items-center justify-between border-b border-white/10 overflow-x-auto scrollbar-none gap-4">
        <div className="flex items-center gap-6 sm:gap-8 whitespace-nowrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm sm:text-[15px] font-medium transition-all relative cursor-pointer ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#8b5cf6] rounded-t-full shadow-sm shadow-purple-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Far Right Action: + Create campaign */}
        <div className="pb-2 sm:pb-0 shrink-0">
          <button
            onClick={() => navigate('/build')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#8b5cf6] text-white text-xs sm:text-sm font-medium hover:bg-[#8b5cf6]/20 transition-all shadow-sm hover:shadow-purple-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-purple-300" />
            <span>+ Create campaign</span>
          </button>
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* 1. RECOMMENDATION / OPTIMIZE TAB */}
      {activeTab === 'recommendation' && (
        <div className="space-y-6 pt-2">
          
          {/* If No Connected Ad Account: Display empty state as shown in screenshot */}
          {!isMetaConnected || adAccounts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-gray-400 text-sm sm:text-base font-normal mb-4">
                No accounts available for this workspace.
              </p>
              <button
                onClick={handleConnectMeta}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isConnecting ? 'Connecting to Meta...' : 'Connect Meta Ad Account'}
              </button>
            </div>
          ) : (
            /* Connected State: Rich AI Recommendations & Optimization Engine */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Workspace Account Status Banner */}
              <div className="bg-[#12111c] border border-purple-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-white font-semibold text-base">
                        AI Autonomous Optimization Engine
                      </h3>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        Active Workspace: {metaAccountName || 'Vansh Jaat'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Connected Ad Account: <span className="text-purple-300 font-mono">{selectedAdAccount || 'act_1441161704572702'}</span> • AI Confidence Score: 98.4%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 hidden sm:inline">Auto-Pilot:</span>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
                    <button className="px-3 py-1 rounded-lg bg-[#7c3aed] text-white font-medium shadow-sm">AI Recommender</button>
                    <button className="px-3 py-1 rounded-lg text-gray-400 hover:text-white transition-colors">Autonomous Mode</button>
                  </div>
                </div>
              </div>

              {/* AI Strategic Recommendations Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Recommendation 1: Budget Scaling */}
                <div className="bg-[#101018] border border-white/10 hover:border-purple-500/40 rounded-2xl p-6 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                            Budget Scaling
                          </span>
                          <h4 className="text-white font-bold text-base mt-1">Scale Top ROAS Ad Set by +20%</h4>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 font-medium">
                        +38% Conv. Potential
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Your campaign <span className="text-white font-medium">"Protein Solution - Traffic"</span> is delivering a high ROAS of <span className="text-emerald-400 font-semibold">3.8x</span> with stable CPA (₹140). AI recommends scaling daily budget from ₹1,000 to ₹1,200 to capture peak conversion traffic.
                    </p>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-gray-300 flex items-center justify-between mb-4">
                      <span>Current Budget: <strong className="text-white">₹1,000/day</strong></span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span>Recommended: <strong className="text-purple-300">₹1,200/day</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyOptimization('rec-1', 'Scale Top ROAS Ad Set')}
                    disabled={appliedRecommendations['rec-1']}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      appliedRecommendations['rec-1']
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-purple-600/20'
                    }`}
                  >
                    {appliedRecommendations['rec-1'] ? (
                      <>
                        <Check className="w-4 h-4" /> Applied Successfully
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> 1-Click Apply Budget Scale
                      </>
                    )}
                  </button>
                </div>

                {/* Recommendation 2: Creative Fatigue */}
                <div className="bg-[#101018] border border-white/10 hover:border-yellow-500/40 rounded-2xl p-6 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-md">
                            Creative Fatigue Alert
                          </span>
                          <h4 className="text-white font-bold text-base mt-1">Refresh Ad Creative #2</h4>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400 font-medium">
                        CTR -22%
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Ad Frequency has reached <span className="text-white font-medium">4.2x</span> for the current audience. Click-through rates have softened. AI can generate 3 high-converting new creative variations instantly.
                    </p>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-gray-300 flex items-center justify-between mb-4">
                      <span>Historical CTR: <strong className="text-white">2.8%</strong></span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span>Current CTR: <strong className="text-yellow-400">1.2% (Fatigued)</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/build')}
                    className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" /> Generate Fresh AI Creatives
                  </button>
                </div>

                {/* Recommendation 3: Audience Expansion */}
                <div className="bg-[#101018] border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                            Audience Expansion
                          </span>
                          <h4 className="text-white font-bold text-base mt-1">Expand Lookalike 1% to 2%</h4>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-400 font-medium">
                        +2.4M Reach
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Your 1% purchaser lookalike has saturated in Tier 1 metros. Expanding to a 2% Lookalike model will unlock high-affinity buyers across Delhi NCR, Bangalore, and Mumbai with estimated 3.2x ROAS.
                    </p>
                  </div>

                  <button
                    onClick={() => handleApplyOptimization('rec-3', 'Expand Lookalike Audience')}
                    disabled={appliedRecommendations['rec-3']}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      appliedRecommendations['rec-3']
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-purple-600/20'
                    }`}
                  >
                    {appliedRecommendations['rec-3'] ? (
                      <>
                        <Check className="w-4 h-4" /> Expansion Applied
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Apply Audience Expansion
                      </>
                    )}
                  </button>
                </div>

                {/* Recommendation 4: Placement Optimization */}
                <div className="bg-[#101018] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            Placement Optimization
                          </span>
                          <h4 className="text-white font-bold text-base mt-1">Boost Instagram Reels Placement</h4>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 font-medium">
                        Save ₹1,400/wk
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Instagram Reels placements convert 48% higher than Audience Network. Reallocating ₹200/day from Audience Network to IG Reels will lower blended CPA by 18%.
                    </p>
                  </div>

                  <button
                    onClick={() => handleApplyOptimization('rec-4', 'Boost Instagram Reels Placement')}
                    disabled={appliedRecommendations['rec-4']}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      appliedRecommendations['rec-4']
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-purple-600/20'
                    }`}
                  >
                    {appliedRecommendations['rec-4'] ? (
                      <>
                        <Check className="w-4 h-4" /> Placement Optimized
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> 1-Click Optimize Placements
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 pt-2">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Leads', value: '71,897', change: '+12.4%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'Avg. Traffic', value: '58.16%', change: '+2.02%', icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { label: 'Avg. CPC', value: '₹1.24', change: '-4.05%', icon: MousePointerClick, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { label: 'Conversions', value: '24.57%', change: '+5.40%', icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                </div>
                <stat.icon className="absolute -right-4 -bottom-4 w-28 h-28 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* Area Chart */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Traffic vs Leads Over Time</h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time performance metrics tracking across Meta campaigns</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Leads
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Traffic
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#12121a', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXECUTIVE SUMMARY TAB */}
      {activeTab === 'executive' && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Ad Spend</p>
              <h3 className="text-3xl font-bold text-white mt-2">₹12,800</h3>
              <p className="text-xs text-emerald-400 mt-2 font-medium">92% spent on high-converting ad sets</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Blended ROAS</p>
              <h3 className="text-3xl font-bold text-purple-400 mt-2">3.42x</h3>
              <p className="text-xs text-emerald-400 mt-2 font-medium">+0.6x compared to last week</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Estimated Revenue</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-2">₹43,776</h3>
              <p className="text-xs text-gray-400 mt-2">Based on verified pixel purchase events</p>
            </div>
          </div>

          <div className="bg-[#12111c] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Executive AI Briefing</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Meta campaigns are currently operating efficiently. The highest conversion volume is driven by Video Hook Creatives on Instagram Reels. Audience expansion into Tier 2 cities has maintained an average CPC below ₹1.30. Recommendation is to keep scaling budget by 15-20% weekly.
            </p>
          </div>
        </div>
      )}

      {/* 4. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Placement & Channel Distribution</h3>
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={platformData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs mt-2">
                {platformData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-300">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">Daily Spend vs Conversion Volume</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} />
                    <Bar dataKey="spend" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MY CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Live Meta Campaigns</h3>
            <button
              onClick={fetchCampaigns}
              className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCampaigns ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
              <Target className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h4 className="text-white font-medium text-base mb-1">No campaigns created yet</h4>
              <p className="text-gray-400 text-xs mb-4">Create and publish your first AI marketing campaign directly to Meta.</p>
              <button
                onClick={() => navigate('/build')}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs px-4 py-2 rounded-xl font-medium"
              >
                + Create Campaign Now
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-black/40 text-gray-400 border-b border-white/5">
                  <tr>
                    <th className="p-4">Campaign Name</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Objective</th>
                    <th className="p-4">Daily Budget</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {campaigns.map((camp, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        {camp.name}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          camp.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 font-mono text-xs">{camp.objective}</td>
                      <td className="p-4 text-gray-300">{camp.daily_budget ? `₹${camp.daily_budget / 100}` : '₹1,000'}</td>
                      <td className="p-4 text-right">
                        <a
                          href={`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${(selectedAdAccount || '1441161704572702').replace('act_', '')}&selected_campaign_ids=${camp.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs"
                        >
                          Meta Ads Manager <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. AUTOMATED ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 pt-2">
          {[
            { title: 'Budget Anomaly Guard', desc: 'No abnormal spending spikes detected in the last 48 hours.', status: 'Healthy', color: 'text-emerald-400' },
            { title: 'Meta Pixel Purchase Event Tracking', desc: 'Active & receiving 140+ events/day.', status: 'Active', color: 'text-emerald-400' },
            { title: 'Ad Creative Saturation Threshold', desc: 'Audience fatigue warning flagged on 1 ad creative.', status: 'Attention', color: 'text-yellow-400' },
          ].map((alert, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{alert.desc}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-white/5 ${alert.color}`}>
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 7. CUSTOM REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center space-y-4 pt-2">
          <Download className="w-10 h-10 text-purple-400 mx-auto" />
          <h3 className="text-lg font-semibold text-white">Generate Executive Performance Report</h3>
          <p className="text-gray-400 text-xs max-w-md mx-auto">
            Export full ROI, ROAS, CPC, CTR and demographic metrics to PDF / CSV format.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button 
              onClick={() => showNotification("Exporting CSV report...")}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium"
            >
              Export CSV
            </button>
            <button 
              onClick={() => showNotification("Generating PDF summary...")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            >
              Export PDF
            </button>
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT WIDGET (Cute Glowing Robot matching screenshot) */}
      <AIAssistantWidget currentAdAccount={metaAccountName || selectedAdAccount} />

    </div>
  );
}

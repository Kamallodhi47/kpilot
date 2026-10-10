import React, { useState, useEffect } from 'react';
import { 
  Play, Settings, Image as ImageIcon, CheckCircle2, Circle, MessageSquare, 
  Mic, Send, Paperclip, Moon, Sun, BarChart2, Sparkles, ExternalLink, Globe, 
  ShieldCheck, RefreshCw, AlertCircle, ArrowRight, Zap, Target, Volume2, 
  Folder, Layers, Radio, Check, ChevronDown, Maximize2, X, FileText, ChevronRight,
  Columns
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface AdAccount {
  id: string;
  account_id: string;
  name: string;
  currency: string;
  account_status: number;
}

interface CampaignData {
  id?: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: number;
}

export default function CampaignBuilder() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Active step in the workflow (1: Details, 2: Planning, 3: Creatives, 4: Preview, 5: Launch)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDraftStarted, setIsDraftStarted] = useState<boolean>(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'campaign' | 'pixeo' | 'analytics'>('campaign');
  const [isNeoPanelOpen, setIsNeoPanelOpen] = useState<boolean>(true);

  // User Profile
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('U');
  const [userEmail, setUserEmail] = useState('');

  // Meta Integration State
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  
  // AI Campaign Form State
  const [productName, setProductName] = useState('Organic Whey Isolate Protein');
  const [targetAudience, setTargetAudience] = useState('Gym enthusiasts, athletes & fitness lovers (Age 20-38)');
  const [dailyBudget, setDailyBudget] = useState(1000);
  const [objective, setObjective] = useState('OUTCOME_SALES');
  const [websiteUrl, setWebsiteUrl] = useState('https://adds.proteinsolution.in');
  
  // Generated AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [selectedHeadline, setSelectedHeadline] = useState('');
  const [selectedPrimaryText, setSelectedPrimaryText] = useState('');
  const [selectedCta, setSelectedCta] = useState('SHOP_NOW');
  
  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedResult, setPublishedResult] = useState<any>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  
  // Live Campaigns State
  const [liveCampaigns, setLiveCampaigns] = useState<CampaignData[]>([]);
  
  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'neo'; text: string; time?: string }>>([
    { 
      sender: 'neo', 
      text: "Hello! I'm NEO, your autonomous AI marketing agent. What campaign would you like to build or launch today?",
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // 1. Fetch User Profile
  useEffect(() => {
    fetch('/api/auth/me', { headers: { ...getAuthHeader() } })
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
        if (data.initial) setUserInitial(data.initial);
        if (data.email) setUserEmail(data.email);
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Fetch Meta Status & Ad Accounts
  const fetchStatus = () => {
    fetch('/api/meta/status', {
      headers: { ...getAuthHeader() }
    })
      .then(res => res.json())
      .then(data => {
        setIsMetaConnected(Boolean(data.connected));
        if (data.connected) {
          setAccountName(data.account_name);
          setAdAccounts(data.ad_accounts || []);
          if (data.selected_ad_account_id) {
            setSelectedAdAccount(data.selected_ad_account_id);
          } else if (data.ad_accounts && data.ad_accounts.length > 0) {
            setSelectedAdAccount(data.ad_accounts[0].id);
          }
        }
      })
      .catch(err => console.error(err));
  };

  // 3. Fetch Live Campaigns
  const fetchCampaigns = () => {
    fetch('/api/meta/campaigns', {
      headers: { ...getAuthHeader() }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setLiveCampaigns(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStatus();
    fetchCampaigns();

    if (location.state && (location.state as any).initialPrompt) {
      const initPrompt = (location.state as any).initialPrompt;
      setProductName(initPrompt);
      setIsDraftStarted(true);
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: initPrompt, time: 'Just now' },
        { sender: 'neo', text: `Got it! I've started a new campaign draft for "${initPrompt}". Let's configure the campaign details or click "Generate AI Strategy".`, time: 'Just now' }
      ]);
    }
  }, [location.state]);

  const handleSelectAccount = async (accId: string) => {
    setSelectedAdAccount(accId);
    try {
      const res = await fetch('/api/meta/select-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ ad_account_id: accId })
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error('Failed to select account:', err);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setPublishedResult(null);
    setPublishError(null);
    setIsDraftStarted(true);
    try {
      const res = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          target_audience: targetAudience,
          daily_budget: dailyBudget,
          objective: objective,
          website_url: websiteUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedData(data);
        setSelectedHeadline(data.headlines[0] || '');
        setSelectedPrimaryText(data.primary_texts[0] || '');
        setSelectedCta(data.call_to_action || 'SHOP_NOW');
        setCurrentStep(3);
        
        setChatMessages(prev => [
          ...prev,
          { sender: 'neo', text: `✨ I have generated a complete marketing plan for "${productName}" with 3 high-converting copies and Meta targeting. Review and launch!`, time: 'Just now' }
        ]);
      }
    } catch (err: any) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  const handlePublishToMeta = async () => {
    setIsPublishing(true);
    setPublishError(null);
    try {
      const res = await fetch('/api/meta/publish-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          ad_account_id: selectedAdAccount,
          campaign_name: generatedData?.suggested_campaign_name || `${productName} - AI Campaign`,
          objective: objective,
          daily_budget: dailyBudget,
          headline: selectedHeadline,
          primary_text: selectedPrimaryText,
          website_url: websiteUrl,
          call_to_action: selectedCta,
          status: 'PAUSED'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishedResult(data);
        fetchCampaigns();
        setCurrentStep(5);
        setChatMessages(prev => [
          ...prev,
          { sender: 'neo', text: `🚀 Great news! Your Meta Campaign has been successfully published to Ad Account ${data.ad_account_id} with Campaign ID #${data.campaign_id}.`, time: 'Just now' }
        ]);
      } else {
        setPublishError(data.detail || data.error || 'Failed to publish campaign to Meta');
      }
    } catch (err: any) {
      setPublishError(err.message || 'Network error publishing to Meta');
    }
    setIsPublishing(false);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setChatInput('');
    setIsDraftStarted(true);
    
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'neo', text: `I understand! Formulating AI strategy for "${userMsg}". You can adjust parameters in the Studio or click Generate AI Campaign.`, time: 'Just now' }
      ]);
    }, 600);
  };

  const workflowSteps = [
    {
      id: 1,
      title: 'Campaign Details',
      subtitle: 'Capturing campaign details',
      statusTag: 'CAPTURING',
    },
    {
      id: 2,
      title: 'Campaign Planning',
      subtitle: 'Build the campaign structure',
      statusTag: 'READY',
    },
    {
      id: 3,
      title: 'Creative Generation',
      subtitle: 'Generate creative direction',
      statusTag: 'AI ENGINE',
    },
    {
      id: 4,
      title: 'Ad Preview',
      subtitle: 'Prepare ads and messaging',
      statusTag: 'PREVIEW',
    },
    {
      id: 5,
      title: 'Launch',
      subtitle: 'Review and publish the campaign',
      statusTag: '1-CLICK META',
    },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#f8fafc] dark:bg-[#07070b] text-slate-900 dark:text-white overflow-hidden p-3 sm:p-4 gap-3 font-sans select-none animate-in fade-in duration-300">
      
      {/* ================= TOP HEADER (XENO + CONTROLS) ================= */}
      <div className="flex items-center justify-between px-2 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans uppercase">
          XENO
        </h1>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-14 h-7 bg-slate-200 dark:bg-[#1c1c28] border border-slate-300 dark:border-white/10 rounded-full p-1 transition-all cursor-pointer hover:border-purple-500/40"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            <div className="w-5 h-5 rounded-full bg-white dark:bg-[#0d091a] flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </div>
          </button>

          {/* User Profile Avatar */}
          <div 
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white/10 cursor-pointer hover:opacity-90"
            title={userEmail ? `User: ${userEmail}` : `User: ${userName}`}
          >
            {userInitial}
          </div>
        </div>
      </div>

      {/* ================= MAIN SPLIT WORKSPACE BODY ================= */}
      <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
        
        {/* ================= LEFT / CENTER WORKSPACE CONTAINER ================= */}
        <div className="flex-1 bg-white dark:bg-[#090912] border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-sm dark:shadow-2xl relative">
          
          {/* SUBHEADER: Campaign Workspace & Controls */}
          <div className="h-14 flex items-center justify-between px-5 bg-white dark:bg-[#0b0b14] border-b border-slate-100 dark:border-white/5 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-gray-300 shadow-sm">
                <Columns className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Campaign Workspace
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono">project-2481</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#ede9fe]/70 dark:bg-[#12111d] border border-purple-200/80 dark:border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-purple-950 dark:text-gray-300 cursor-pointer hover:border-purple-400 transition-colors">
                <span className="font-medium">{liveCampaigns.length > 0 ? `${liveCampaigns.length} campaigns active` : 'No campaigns yet.'}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-2 text-purple-700 dark:text-gray-500" />
              </div>

              <button
                onClick={() => {
                  setIsDraftStarted(true);
                  setCurrentStep(1);
                }}
                className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
              >
                New campaign
              </button>
            </div>
          </div>

          {/* WORKSPACE MAIN BODY: STEPPER + CANVAS */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* STEPPER WORKFLOW TIMELINE */}
            <div className="w-[270px] sm:w-[285px] lg:w-[300px] border-r border-slate-100 dark:border-white/5 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 relative overflow-hidden bg-white dark:bg-[#080810]">
              
              {/* Continuous Vertical Connector Line */}
              <div className="absolute left-[30px] top-[28px] bottom-[28px] w-[1.5px] bg-slate-200 dark:bg-white/15 pointer-events-none z-0" />

              <div className="flex flex-col justify-between h-full space-y-2 relative z-10">
                {workflowSteps.map((step) => {
                  const isActive = currentStep === step.id;

                  return (
                    <div
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`
                        p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between
                        ${isActive 
                          ? 'bg-[#f5f3ff] dark:bg-[#151226] border-purple-300 dark:border-[#8b5cf6] shadow-sm ring-1 ring-purple-400/30 dark:ring-[#8b5cf6]/40' 
                          : 'bg-white dark:bg-[#0e0e18] border-transparent hover:border-slate-200 dark:hover:border-white/20'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          
                          {/* Step Icon */}
                          {step.id === 1 && isActive ? (
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-[#201538] border border-purple-300 dark:border-purple-500/50 flex items-center justify-center relative shrink-0 shadow-sm">
                              <div className="w-6 h-6 rounded-full border border-purple-400/60 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-600 dark:bg-[#c084fc] shadow-sm" />
                              </div>
                            </div>
                          ) : (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                              isActive 
                                ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
                                : 'bg-slate-100 dark:bg-[#151522] text-slate-700 dark:text-gray-400 border border-slate-200 dark:border-white/15'
                            }`}>
                              {step.id}
                            </div>
                          )}

                          <div>
                            <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight ${
                              isActive 
                                ? 'text-purple-950 dark:text-[#e9d5ff]' 
                                : 'text-slate-800 dark:text-[#cbd5e1]'
                            }`}>
                              {step.title}
                            </h4>
                            <p className={`text-[11px] mt-0.5 leading-snug font-medium ${
                              isActive 
                                ? 'text-purple-700 dark:text-[#c084fc]' 
                                : 'text-slate-500 dark:text-[#64748b]'
                            }`}>
                              {step.subtitle}
                            </p>
                          </div>
                        </div>

                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-[#a855f7] shadow-sm shrink-0 mt-1" />
                        )}
                      </div>

                      {isActive && (
                        <div className="mt-2 pt-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wider font-mono text-purple-700 dark:text-[#c084fc]">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-[#c084fc] animate-pulse" />
                          <span className="ml-0.5 uppercase">● {step.statusTag}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CANVAS AREA */}
            <div className="flex-1 flex flex-col overflow-y-auto p-5 sm:p-6 bg-white dark:bg-[#0b0b14] scrollbar-thin">
              
              {/* LAUNCH READINESS CARD (EXACT PURPLE BORDER STYLE FROM SCREENSHOT) */}
              <div className="w-full bg-white dark:bg-[#0d0d17] border-2 border-indigo-200/80 dark:border-white/10 rounded-2xl p-6 mb-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-widest text-indigo-600 dark:text-[#818cf8] uppercase font-mono">
                    LAUNCH READINESS
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/20 text-xs text-slate-700 dark:text-gray-200 font-medium">
                    <span className={`w-2 h-2 rounded-full ${isMetaConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    <span>{isMetaConnected ? 'Connected' : 'Unknown'}</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Are you ready to launch your campaign?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 mb-5">
                  {isMetaConnected 
                    ? `Active account: ${accountName || 'Vansh Jaat'} (${selectedAdAccount || 'act_1441161704572702'}). Ready to launch!` 
                    : "We couldn't check your ad accounts right now."}
                </p>

                <div>
                  <button
                    onClick={fetchStatus}
                    className="px-5 py-2.5 rounded-full bg-[#5b3af6] hover:bg-[#4f2ee8] text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    Connect ad accounts
                  </button>
                </div>
              </div>

              {/* DRAFT NOT STARTED YET CARD (DASHED PURPLE BORDER CONTAINER) */}
              {!isDraftStarted && currentStep === 1 ? (
                <div className="w-full border-2 border-dashed border-indigo-200/80 dark:border-white/20 rounded-2xl p-6 text-left shadow-sm bg-white dark:bg-transparent">
                  <div className="flex items-start gap-4">
                    {/* Left Circle Icon */}
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-gray-400 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>

                    {/* Text Details & Buttons */}
                    <div className="flex-1">
                      <span className="text-[11px] font-bold tracking-widest text-indigo-600 dark:text-[#818cf8] uppercase font-mono">
                        NEW CAMPAIGN
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                        Draft not started yet
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 leading-relaxed max-w-xl">
                        Start a fresh campaign from chat or pick an existing project from the project list.
                      </p>

                      <div className="flex items-center gap-2.5 mt-5">
                        <button
                          onClick={() => {
                            setIsDraftStarted(true);
                            setCurrentStep(1);
                          }}
                          className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-black/40 dark:hover:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
                        >
                          Open chat
                        </button>
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-black/40 dark:hover:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-gray-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
                        >
                          Projects
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Studio Forms */
                <div className="space-y-6 animate-in fade-in duration-300">
                  {(currentStep === 1 || currentStep === 2) && (
                    <div className="bg-white dark:bg-[#100f1c] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Campaign Setup & Strategy</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 font-mono">Step {currentStep}/5</span>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Product Name</label>
                          <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g. 100% Organic Whey Protein"
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Target Audience</label>
                          <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g. Fitness enthusiasts, athletes in India"
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Daily Budget (INR)</label>
                            <input
                              type="number"
                              value={dailyBudget}
                              onChange={(e) => setDailyBudget(Number(e.target.value))}
                              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Objective</label>
                            <select
                              value={objective}
                              onChange={(e) => setObjective(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                              <option value="OUTCOME_SALES">Conversions & Sales</option>
                              <option value="OUTCOME_TRAFFIC">Website Traffic</option>
                              <option value="OUTCOME_LEADS">Lead Generation</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/5">
                        <button
                          onClick={handleGenerateAI}
                          disabled={isGenerating || !productName.trim()}
                          className="px-5 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>{isGenerating ? 'Formulating Campaign...' : 'Generate AI Strategy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Creative Selection */}
                  {currentStep === 3 && generatedData && (
                    <div className="bg-white dark:bg-[#100f1c] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Select High-Converting Copy</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono">Step 3/5</span>
                      </div>

                      <div className="space-y-3">
                        {generatedData.primary_texts.map((text: string, i: number) => (
                          <div
                            key={i}
                            onClick={() => setSelectedPrimaryText(text)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              selectedPrimaryText === text
                                ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 ring-1 ring-purple-500/30'
                                : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/5 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 font-mono">Variation #{i + 1}</span>
                              {selectedPrimaryText === text && <Check className="w-3.5 h-3.5 text-purple-600" />}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-gray-200 leading-relaxed">{text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                        <button onClick={() => setCurrentStep(2)} className="text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">Back</button>
                        <button onClick={() => setCurrentStep(4)} className="px-5 py-2 rounded-xl bg-[#7c3aed] text-white text-xs font-bold flex items-center gap-1.5">
                          <span>Preview Ad</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4 & 5: Preview & Launch */}
                  {(currentStep === 4 || currentStep === 5) && (
                    <div className="bg-white dark:bg-[#100f1c] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Meta Ad Preview & Launch</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono">
                          {publishedResult ? 'PUBLISHED' : 'READY'}
                        </span>
                      </div>

                      {publishedResult ? (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs space-y-2 text-center">
                          <CheckCircle2 className="w-6 h-6 mx-auto" />
                          <p className="font-bold">Campaign Published to Meta Successfully!</p>
                          <p className="text-slate-600 dark:text-gray-300">Campaign ID: <span className="font-mono text-slate-900 dark:text-white">{publishedResult.campaign_id}</span></p>
                          <a href={publishedResult.ads_manager_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-purple-600 underline font-semibold mt-1">
                            View in Meta Ads Manager <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/5">
                          <button
                            onClick={handlePublishToMeta}
                            disabled={isPublishing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                            <span>{isPublishing ? 'Launching on Meta...' : '1-Click Launch on Meta'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* BOTTOM NAVIGATION BAR: EXACT 3-PILL SEGMENTED CONTROL FROM SCREENSHOT */}
          <div className="p-2 sm:p-3 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#07070d] shrink-0">
            <div className="w-full bg-slate-50 dark:bg-[#0d0d16] border border-slate-200/80 dark:border-white/10 rounded-2xl p-1.5 grid grid-cols-3 gap-2 shadow-inner">
              
              {/* Tab 1: Campaign */}
              <button
                onClick={() => setActiveBottomTab('campaign')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeBottomTab === 'campaign'
                    ? 'bg-[#5b3af6] text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Campaign</span>
              </button>

              {/* Tab 2: Pixeo */}
              <button
                onClick={() => navigate('/pixeo')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeBottomTab === 'pixeo'
                    ? 'bg-[#5b3af6] text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Pixeo</span>
              </button>

              {/* Tab 3: Analytics */}
              <button
                onClick={() => navigate('/neo')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeBottomTab === 'analytics'
                    ? 'bg-[#5b3af6] text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================= RIGHT PANEL: NEO AI ASSISTANT ================= */}
        {isNeoPanelOpen && (
          <div className="w-[310px] sm:w-[340px] lg:w-[370px] bg-white dark:bg-[#090912] border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl flex flex-col shrink-0 relative overflow-hidden shadow-sm dark:shadow-2xl">
            
            {/* NEO Header */}
            <div className="h-14 flex items-center justify-between px-4 bg-white dark:bg-[#0b0b14] border-b border-slate-100 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wider">NEO</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 dark:text-gray-400">
                <button className="p-1.5 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsNeoPanelOpen(false)} className="p-1.5 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* NEO Messages Canvas (Subtle Dot Matrix Background Matching Screenshot) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 relative bg-slate-50/40 dark:bg-[#090912] bg-[radial-gradient(#64748b15_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
              
              {/* Message 1 (Report status) */}
              <div className="flex flex-col items-start">
                <div className="max-w-[95%] rounded-2xl px-4 py-3 text-xs leading-relaxed bg-white dark:bg-[#141420] text-slate-800 dark:text-gray-200 border border-slate-200/80 dark:border-white/10 shadow-sm">
                  <p>I'm working on generating a comprehensive performance report for the current campaign, including all the traffic metrics from Meta and Google. It's queued up and will give you detailed insights once it's finished. You'll get a clear overview of how your campaign is performing across these platforms. Please hold on a bit while the report is being prepared.</p>
                </div>
              </div>

              {/* Message 2 (Brand account follow-up) */}
              <div className="flex flex-col items-start">
                <div className="max-w-[95%] rounded-2xl px-4 py-3 text-xs leading-relaxed bg-white dark:bg-[#141420] text-slate-800 dark:text-gray-200 border border-slate-200/80 dark:border-white/10 shadow-sm">
                  <p>It looks like we hit a snag: there's no account brand associated with this campaign, so the report couldn't be generated. To move forward, we need to confirm the brand or account details. Could you provide the brand name or any related information?</p>
                </div>
              </div>

              {chatMessages.slice(1).map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#5b3af6] text-white rounded-br-none shadow-md'
                        : 'bg-white dark:bg-[#141420] text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* NEO Input Box Matching Screenshot */}
            <div className="p-3 bg-white dark:bg-[#0a0a12] border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleSendChatMessage} className="space-y-2">
                <div className="bg-slate-50 dark:bg-[#12111d] border border-slate-200 dark:border-white/10 focus-within:border-purple-500 rounded-2xl p-2.5 transition-all shadow-inner">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask NEO to launch, create, or analyze"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-gray-500 px-1 font-medium"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400">
                      <button type="button" className="p-1.5 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 bg-[#5b3af6] text-white rounded-lg transition-colors shadow-sm">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-1.5 rounded-xl bg-slate-200 dark:bg-[#7c3aed] hover:bg-[#5b3af6] hover:text-white text-slate-600 dark:text-white disabled:opacity-40 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

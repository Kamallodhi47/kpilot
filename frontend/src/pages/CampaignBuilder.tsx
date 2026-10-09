import React, { useState, useEffect } from 'react';
import { 
  Play, Settings, Image as ImageIcon, CheckCircle2, Circle, MessageSquare, 
  Mic, Send, Paperclip, Moon, BarChart2, Sparkles, ExternalLink, Globe, 
  ShieldCheck, RefreshCw, AlertCircle, ArrowRight, Zap, Target, Volume2, 
  Folder, Layers, Radio, Check, ChevronDown, Maximize2, X, FileText, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [customAdAccountInput, setCustomAdAccountInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
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

    // Check if initial prompt was passed from Home
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

  // Switch or Verify Ad Account
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
        setShowCustomInput(false);
        fetchCampaigns();
      }
    } catch (err) {
      console.error('Failed to select account:', err);
    }
  };

  // AI Campaign Generation
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
        setCurrentStep(3); // Advance to Creative Generation
        
        // Add chat feedback
        setChatMessages(prev => [
          ...prev,
          { sender: 'neo', text: `✨ I have generated a complete marketing plan for "${productName}" with 3 high-converting copies and Meta targeting. Review the creatives and click Next to preview!`, time: 'Just now' }
        ]);
      }
    } catch (err: any) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  // 1-Click Meta Publish
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
        { sender: 'neo', text: `I understand! Formulating AI strategy for "${userMsg}". You can adjust parameters in the Campaign Studio on the left or click Generate AI Campaign.`, time: 'Just now' }
      ]);
    }, 600);
  };

  const workflowSteps = [
    {
      id: 1,
      title: 'Campaign Details',
      subtitle: 'Capturing campaign details',
      statusTag: '● CAPTURING',
      iconType: 'radar'
    },
    {
      id: 2,
      title: 'Campaign Planning',
      subtitle: 'Build the campaign structure',
      statusTag: 'READY',
      iconType: 'number'
    },
    {
      id: 3,
      title: 'Creative Generation',
      subtitle: 'Generate creative direction',
      statusTag: 'AI ENGINE',
      iconType: 'number'
    },
    {
      id: 4,
      title: 'Ad Preview',
      subtitle: 'Prepare ads and messaging',
      statusTag: 'PREVIEW',
      iconType: 'number'
    },
    {
      id: 5,
      title: 'Launch',
      subtitle: 'Review and publish the campaign',
      statusTag: '1-CLICK META',
      iconType: 'number'
    },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#07070b] text-white overflow-hidden select-none font-sans">
      
      {/* 1. TOP HEADER - Exact match to screenshot */}
      <div className="h-14 flex items-center justify-between px-6 bg-[#07070b] border-b border-white/10 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black tracking-wider text-white font-sans">
            XENO
          </h1>
        </div>

        {/* Right Header Controls: Theme toggle & Avatar */}
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center justify-between w-12 h-6 bg-[#181824] border border-white/10 rounded-full p-1 transition-all cursor-pointer hover:border-purple-500/40"
            title="Toggle Theme"
          >
            <div className="w-4 h-4 rounded-full bg-[#0d091a] flex items-center justify-center text-purple-300 shadow-inner">
              <Moon className="w-3 h-3" />
            </div>
          </button>

          {/* User Initial Circle */}
          <div 
            className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xs shadow-md ring-2 ring-white/10 cursor-pointer"
            title={userEmail ? `User: ${userEmail}` : `User: ${userName}`}
          >
            {userInitial}
          </div>
        </div>
      </div>

      {/* 2. SUBHEADER: Campaign Workspace & NEO Header */}
      <div className="h-12 flex items-center justify-between px-6 bg-[#0a0a12] border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Campaign Workspace
            </h2>
            <p className="text-[11px] text-gray-400 font-mono">project-2481</p>
          </div>
        </div>

        {/* Middle Controls: Campaign selector & New Campaign */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#13121f] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 cursor-pointer hover:border-white/20">
            <span>{liveCampaigns.length > 0 ? `${liveCampaigns.length} campaigns active` : 'No campaigns yet.'}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-2 text-gray-500" />
          </div>

          <button
            onClick={() => {
              setIsDraftStarted(true);
              setCurrentStep(1);
            }}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            New campaign
          </button>
        </div>

        {/* Right Panel Header: NEO */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>NEO</span>
          </div>
          <button 
            onClick={() => setIsNeoPanelOpen(!isNeoPanelOpen)}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsNeoPanelOpen(false)}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE 3-COLUMN SPLIT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ================= COLUMN 1: LEFT STEPPER WORKFLOW (EXACT MATCH TO SCREENSHOT) ================= */}
        <div className="w-[290px] sm:w-[320px] bg-[#090910] border-r border-white/5 flex flex-col shrink-0 p-3 relative overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Continuous Vertical Connector Line running through all step icons */}
          <div className="absolute left-[33px] top-[26px] bottom-[28px] w-[1.5px] bg-white/15 pointer-events-none z-0" />

          <div className="space-y-3 relative z-10">
            {workflowSteps.map((step) => {
              const isActive = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`
                    p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between
                    ${isActive 
                      ? 'bg-[#151226] border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.2)] ring-1 ring-[#8b5cf6]/40' 
                      : 'bg-[#0e0e18] border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Main Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      
                      {/* Step Icon with exact Concentric Radar for Step 1 */}
                      {step.id === 1 && isActive ? (
                        <div className="w-9 h-9 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center relative shrink-0 shadow-inner">
                          {/* Outer Ripple */}
                          <div className="w-7 h-7 rounded-full border border-purple-400/40 flex items-center justify-center">
                            {/* Middle Ring */}
                            <div className="w-4 h-4 rounded-full border border-purple-300/60 flex items-center justify-center">
                              {/* Inner Glowing Core */}
                              <div className="w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isActive 
                            ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
                            : 'bg-[#151522] text-gray-400 border border-white/15 group-hover:border-white/30'
                        }`}>
                          {step.id}
                        </div>
                      )}

                      {/* Text Details */}
                      <div>
                        <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight ${
                          isActive ? 'text-[#e9d5ff]' : 'text-[#cbd5e1]'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-[11px] mt-0.5 leading-snug ${
                          isActive ? 'text-[#c084fc]/80' : 'text-[#64748b]'
                        }`}>
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Far Right Active Purple Dot */}
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_6px_#a855f7] shrink-0 mt-1" />
                    )}
                  </div>

                  {/* Status Badge below */}
                  {isActive && (
                    <div className="mt-2.5 pt-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wider font-mono text-[#c084fc]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                      <span>{step.statusTag}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ================= COLUMN 2: CENTER WORKSPACE CANVAS ================= */}
        <div className="flex-1 bg-[#0b0b12] flex flex-col overflow-hidden relative">
          
          {/* Top Connect Bar */}
          <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#0e0e18]/80">
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStatus}
                className="px-4 py-2 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isMetaConnected ? `Connected: ${accountName || 'Vansh Jaat'}` : 'Connect ad accounts'}</span>
              </button>
              
              {isMetaConnected && (
                <span className="text-xs text-gray-400 hidden md:inline">
                  Ad Account: <strong className="text-purple-300 font-mono">{selectedAdAccount || 'act_1441161704572702'}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={selectedAdAccount}
                onChange={(e) => handleSelectAccount(e.target.value)}
                className="bg-[#181828] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-purple-500 cursor-pointer"
              >
                {adAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Canvas Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            
            {/* If Draft Not Started: Show the exact Draft Card from Screenshot */}
            {!isDraftStarted && currentStep === 1 ? (
              <div className="max-w-2xl mx-auto my-12 bg-[#12111e] border border-dashed border-purple-500/20 rounded-3xl p-8 text-left shadow-2xl relative overflow-hidden group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase font-mono">
                      NEW CAMPAIGN
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Draft not started yet
                    </h3>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Start a fresh campaign from chat or pick an existing project from the project list.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsDraftStarted(true);
                      setCurrentStep(1);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1d1b2e] hover:bg-[#26233d] border border-white/10 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    Open chat
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all"
                  >
                    Projects
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Step Form Engine */
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                
                {/* Step 1 & 2: Campaign Details & Planning Form */}
                {(currentStep === 1 || currentStep === 2) && (
                  <div className="bg-[#12111f] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Campaign Setup & Strategy</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Define your offering and let Cloud AI formulate targeting</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                        Step {currentStep} of 5
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Product / Service Name
                        </label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g. 100% Organic Whey Protein"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Target Audience / Ideal Customer
                        </label>
                        <input
                          type="text"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          placeholder="e.g. Fitness enthusiasts, athletes in Tier 1 Indian cities"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                            Daily Budget (INR)
                          </label>
                          <input
                            type="number"
                            value={dailyBudget}
                            onChange={(e) => setDailyBudget(Number(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                            Campaign Objective
                          </label>
                          <select
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                          >
                            <option value="OUTCOME_SALES">Conversions & Sales</option>
                            <option value="OUTCOME_TRAFFIC">Traffic to Website</option>
                            <option value="OUTCOME_LEADS">Lead Generation</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Landing Page URL
                        </label>
                        <input
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://adds.proteinsolution.in"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <button
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !productName.trim()}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:from-[#6d28d9] hover:to-[#4f46e5] text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>{isGenerating ? 'Formulating AI Campaign...' : 'Generate AI Strategy & Copies'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Creative Generation */}
                {currentStep === 3 && generatedData && (
                  <div className="bg-[#12111f] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Select High-Converting Copy</h3>
                        <p className="text-xs text-gray-400 mt-0.5">AI has written 3 targeted copy variations</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-mono">Step 3 of 5</span>
                    </div>

                    <div className="space-y-4">
                      {generatedData.primary_texts.map((text: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => setSelectedPrimaryText(text)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            selectedPrimaryText === text
                              ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/30'
                              : 'bg-black/30 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-purple-400 font-mono">Option #{i + 1}</span>
                            {selectedPrimaryText === text && <Check className="w-4 h-4 text-purple-400" />}
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-purple-600 text-white text-xs font-semibold transition-all flex items-center gap-2"
                      >
                        <span>Next: Preview Ad</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 & 5: Ad Preview & Launch to Meta */}
                {(currentStep === 4 || currentStep === 5) && (
                  <div className="bg-[#12111f] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Live Meta Ad Preview & Launch</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Ready to publish autonomously to Meta Ad Account</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                        {publishedResult ? 'PUBLISHED' : 'READY TO LAUNCH'}
                      </span>
                    </div>

                    {/* Meta Ad Mock Card */}
                    <div className="max-w-md mx-auto bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-3.5 flex items-center gap-3 border-b border-white/5">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
                          P
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Protein Solution Official</h5>
                          <span className="text-[10px] text-gray-400">Sponsored • Meta Verified</span>
                        </div>
                      </div>

                      <div className="p-3.5 text-xs text-gray-200 leading-relaxed">
                        {selectedPrimaryText || generatedData?.primary_texts[0] || 'High impact protein engineered for peak fitness.'}
                      </div>

                      <div className="aspect-[16/9] bg-gradient-to-tr from-purple-950 via-black to-indigo-950 flex items-center justify-center p-4 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=800&auto=format&fit=crop"
                          alt="Ad Visual"
                          className="w-full h-full object-cover rounded-xl opacity-80"
                        />
                        <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-purple-300 font-mono">
                          {selectedHeadline || 'Exclusive Launch Offer'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-black/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">{websiteUrl.replace('https://', '')}</span>
                          <h6 className="text-xs font-bold text-white">{selectedHeadline || 'Get Premium Protein Today'}</h6>
                        </div>
                        <button className="px-3.5 py-1.5 rounded-lg bg-[#7c3aed] text-white text-xs font-semibold">
                          {selectedCta}
                        </button>
                      </div>
                    </div>

                    {/* Publish Actions */}
                    {publishedResult ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2 text-center">
                        <CheckCircle2 className="w-6 h-6 mx-auto" />
                        <p className="font-bold">Campaign Published to Meta Successfully!</p>
                        <p className="text-gray-300">Campaign ID: <span className="font-mono text-white">{publishedResult.campaign_id}</span></p>
                        <a
                          href={publishedResult.ads_manager_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-purple-400 underline font-semibold mt-2"
                        >
                          View in Meta Ads Manager <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button
                          onClick={handlePublishToMeta}
                          disabled={isPublishing}
                          className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                          <span>{isPublishing ? 'Launching on Meta Graph API...' : '1-Click Launch Campaign on Meta'}</span>
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>

          {/* Bottom Bar: Tabs (Campaign, Pixeo, Analytics) */}
          <div className="h-14 border-t border-white/10 bg-[#090912] px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveBottomTab('campaign')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeBottomTab === 'campaign'
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Campaign</span>
              </button>

              <button
                onClick={() => navigate('/processing')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Pixeo</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            <div className="text-xs text-gray-500 font-mono">
              XENO AI Engine V2.4 Active
            </div>
          </div>

        </div>

        {/* ================= COLUMN 3: RIGHT AI AGENT NEO PANEL ================= */}
        {isNeoPanelOpen && (
          <div className="w-[320px] sm:w-[360px] bg-[#090910] border-l border-white/5 flex flex-col shrink-0 relative">
            
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#7c3aed] text-white rounded-br-none shadow-md'
                        : 'bg-[#141420] text-gray-200 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  {msg.time && (
                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                  )}
                </div>
              ))}
            </div>

            {/* NEO Input Bar */}
            <div className="p-3 bg-[#0c0c16] border-t border-white/5">
              <form onSubmit={handleSendChatMessage} className="space-y-2">
                <div className="bg-[#141422] border border-white/10 focus-within:border-purple-500/60 rounded-2xl p-2.5 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask NEO to launch, create, or analyze"
                    className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none placeholder-gray-500 px-1"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <button type="button" className="p-1.5 hover:text-white rounded-lg transition-colors">
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 hover:text-white rounded-lg transition-colors">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 hover:text-white rounded-lg transition-colors">
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-1.5 rounded-xl bg-[#7c3aed] hover:bg-purple-600 disabled:opacity-40 text-white transition-all shadow-md shadow-purple-600/30 cursor-pointer"
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

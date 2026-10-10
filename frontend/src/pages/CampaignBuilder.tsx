import React, { useState, useEffect } from 'react';
import { 
  Play, Settings, Image as ImageIcon, CheckCircle2, Circle, MessageSquare, 
  Mic, Send, Paperclip, Moon, BarChart2, Sparkles, ExternalLink, Globe, 
  ShieldCheck, RefreshCw, AlertCircle, ArrowRight, Zap, Target, Volume2, 
  Folder, Layers, Radio, Check, ChevronDown, Maximize2, X, FileText, ChevronRight,
  Columns
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
    <div className="h-full w-full flex bg-[#07070b] text-white overflow-hidden p-2.5 sm:p-3 gap-3 font-sans select-none">
      
      {/* ================= LEFT / CENTER WORKSPACE CONTAINER ================= */}
      <div className="flex-1 bg-[#090912] border border-white/10 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* SUBHEADER: Campaign Workspace & Controls */}
        <div className="h-14 flex items-center justify-between px-5 bg-[#0b0b14] border-b border-white/5 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
              <Columns className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                Campaign Workspace
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">project-2481</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#12111d] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-gray-300 cursor-pointer hover:border-white/20">
              <span>{liveCampaigns.length > 0 ? `${liveCampaigns.length} campaigns active` : 'No campaigns yet.'}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-2 text-gray-500" />
            </div>

            <button
              onClick={() => {
                setIsDraftStarted(true);
                setCurrentStep(1);
              }}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-transparent hover:bg-white/5 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              New campaign
            </button>
          </div>
        </div>

        {/* WORKSPACE MAIN BODY: STEPPER + CANVAS */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* STEPPER WORKFLOW TIMELINE (EXACT MATCH TO SCREENSHOT) */}
          <div className="w-[270px] sm:w-[285px] lg:w-[300px] border-r border-white/5 p-3 sm:p-3.5 flex flex-col justify-between shrink-0 relative overflow-hidden bg-[#080810]">
            
            {/* Continuous Vertical Connector Line */}
            <div className="absolute left-[30px] top-[26px] bottom-[28px] w-[1.5px] bg-white/15 pointer-events-none z-0" />

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
                        ? 'bg-[#151226] border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.2)] ring-1 ring-[#8b5cf6]/40' 
                        : 'bg-[#0e0e18] border-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        
                        {/* Step Icon */}
                        {step.id === 1 && isActive ? (
                          <div className="w-8 h-8 rounded-full bg-[#201538] border border-purple-500/50 flex items-center justify-center relative shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                            <div className="w-6 h-6 rounded-full border border-purple-400/40 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]" />
                            </div>
                          </div>
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isActive 
                              ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-500/30' 
                              : 'bg-[#151522] text-gray-400 border border-white/15 group-hover:border-white/30'
                          }`}>
                            {step.id}
                          </div>
                        )}

                        <div>
                          <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight ${
                            isActive ? 'text-[#e9d5ff]' : 'text-[#cbd5e1]'
                          }`}>
                            {step.title}
                          </h4>
                          <p className={`text-[11px] mt-0.5 leading-snug ${
                            isActive ? 'text-[#c084fc]' : 'text-[#64748b]'
                          }`}>
                            {step.subtitle}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_6px_#a855f7] shrink-0 mt-1" />
                      )}
                    </div>

                    {isActive && (
                      <div className="mt-2 pt-1 flex items-center gap-1 text-[10px] font-bold tracking-wider font-mono text-[#c084fc]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse delay-75" />
                        <span className="ml-0.5">{step.statusTag}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CANVAS AREA */}
          <div className="flex-1 flex flex-col overflow-y-auto p-5 sm:p-6 bg-[#0b0b14] scrollbar-thin scrollbar-thumb-white/10">
            
            {/* LAUNCH READINESS CARD */}
            <div className="w-full bg-[#0d0d17] border border-white/10 rounded-2xl p-6 mb-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold tracking-widest text-[#818cf8] uppercase font-mono">
                  LAUNCH READINESS
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs text-gray-200 font-medium">
                  <span className={`w-2 h-2 rounded-full ${isMetaConnected ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                  <span>{isMetaConnected ? 'Connected' : 'Unknown'}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Are you ready to launch your campaign?
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 mb-5">
                {isMetaConnected 
                  ? `Active account: ${accountName || 'Vansh Jaat'} (${selectedAdAccount || 'act_1441161704572702'}). Ready to launch!` 
                  : "We couldn't check your ad accounts right now."}
              </p>

              <div>
                <button
                  onClick={fetchStatus}
                  className="px-5 py-2.5 rounded-full bg-[#5b3af6] hover:bg-[#4f2ee8] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  Connect ad accounts
                </button>
              </div>
            </div>

            {/* DRAFT NOT STARTED YET CARD (DASHED CONTAINER) */}
            {!isDraftStarted && currentStep === 1 ? (
              <div className="w-full border border-dashed border-white/20 rounded-2xl p-6 text-left shadow-lg bg-transparent">
                <div className="flex items-start gap-4">
                  {/* Left Circle Icon */}
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                      <path d="m3.3 7 8.7 5 8.7-5"/>
                      <path d="M12 22V12"/>
                    </svg>
                  </div>

                  {/* Text Details & Buttons */}
                  <div className="flex-1">
                    <span className="text-[11px] font-bold tracking-widest text-[#818cf8] uppercase font-mono">
                      NEW CAMPAIGN
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Draft not started yet
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed max-w-xl">
                      Start a fresh campaign from chat or pick an existing project from the project list.
                    </p>

                    <div className="flex items-center gap-2.5 mt-5">
                      <button
                        onClick={() => {
                          setIsDraftStarted(true);
                          setCurrentStep(1);
                        }}
                        className="px-4 py-1.5 rounded-full bg-black/40 hover:bg-white/10 border border-white/20 text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
                      >
                        Open chat
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-1.5 rounded-full bg-black/40 hover:bg-white/10 border border-white/20 text-gray-200 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
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
                  <div className="bg-[#100f1c] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="text-sm sm:text-base font-bold text-white">Campaign Setup & Strategy</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">Step {currentStep}/5</span>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Product Name</label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g. 100% Organic Whey Protein"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Target Audience</label>
                        <input
                          type="text"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          placeholder="e.g. Fitness enthusiasts, athletes in India"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Daily Budget (INR)</label>
                          <input
                            type="number"
                            value={dailyBudget}
                            onChange={(e) => setDailyBudget(Number(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Objective</label>
                          <select
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option value="OUTCOME_SALES">Conversions & Sales</option>
                            <option value="OUTCOME_TRAFFIC">Website Traffic</option>
                            <option value="OUTCOME_LEADS">Lead Generation</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-white/5">
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
                  <div className="bg-[#100f1c] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="text-sm sm:text-base font-bold text-white">Select High-Converting Copy</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono">Step 3/5</span>
                    </div>

                    <div className="space-y-3">
                      {generatedData.primary_texts.map((text: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => setSelectedPrimaryText(text)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            selectedPrimaryText === text
                              ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/30'
                              : 'bg-black/30 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-purple-400 font-mono">Variation #{i + 1}</span>
                            {selectedPrimaryText === text && <Check className="w-3.5 h-3.5 text-purple-400" />}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <button onClick={() => setCurrentStep(2)} className="text-xs text-gray-400 hover:text-white">Back</button>
                      <button onClick={() => setCurrentStep(4)} className="px-5 py-2 rounded-xl bg-[#7c3aed] text-white text-xs font-bold flex items-center gap-1.5">
                        <span>Preview Ad</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 & 5: Preview & Launch */}
                {(currentStep === 4 || currentStep === 5) && (
                  <div className="bg-[#100f1c] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="text-sm sm:text-base font-bold text-white">Meta Ad Preview & Launch</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                        {publishedResult ? 'PUBLISHED' : 'READY'}
                      </span>
                    </div>

                    {publishedResult ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2 text-center">
                        <CheckCircle2 className="w-6 h-6 mx-auto" />
                        <p className="font-bold">Campaign Published to Meta Successfully!</p>
                        <p className="text-gray-300">Campaign ID: <span className="font-mono text-white">{publishedResult.campaign_id}</span></p>
                        <a href={publishedResult.ads_manager_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-purple-400 underline font-semibold mt-1">
                          View in Meta Ads Manager <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex justify-end pt-3 border-t border-white/5">
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

        {/* BOTTOM NAVIGATION BAR: FULL-WIDTH 3 SEGMENTED CONTROL */}
        <div className="p-2 sm:p-2.5 border-t border-white/5 bg-[#07070d] shrink-0">
          <div className="w-full bg-[#0d0d16] border border-white/10 rounded-2xl p-1 grid grid-cols-3 gap-1 shadow-inner">
            
            {/* Tab 1: Campaign */}
            <button
              onClick={() => setActiveBottomTab('campaign')}
              className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeBottomTab === 'campaign'
                  ? 'bg-[#581c87] text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current mb-0.5" />
              <span>Campaign</span>
            </button>

            {/* Tab 2: Pixeo */}
            <button
              onClick={() => navigate('/pixeo')}
              className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeBottomTab === 'pixeo'
                  ? 'bg-[#581c87] text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 mb-0.5" />
              <span>Pixeo</span>
            </button>

            {/* Tab 3: Analytics */}
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeBottomTab === 'analytics'
                  ? 'bg-[#581c87] text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 mb-0.5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= RIGHT PANEL: NEO AI ASSISTANT ================= */}
      {isNeoPanelOpen && (
        <div className="w-[310px] sm:w-[340px] lg:w-[360px] bg-[#090912] border border-white/10 rounded-2xl sm:rounded-3xl flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
          
          {/* NEO Header */}
          <div className="h-14 flex items-center justify-between px-4 bg-[#0b0b14] border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wider">NEO</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400">
              <button className="p-1 hover:text-white rounded transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsNeoPanelOpen(false)} className="p-1 hover:text-white rounded transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* NEO Messages Canvas (Dot Grid Matrix Background) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 relative bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
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

          {/* NEO Input Box */}
          <div className="p-3 bg-[#0a0a12] border-t border-white/5">
            <form onSubmit={handleSendChatMessage} className="space-y-2">
              <div className="bg-[#12111d] border border-white/10 focus-within:border-purple-500/60 rounded-2xl p-2.5 transition-all">
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
  );
}

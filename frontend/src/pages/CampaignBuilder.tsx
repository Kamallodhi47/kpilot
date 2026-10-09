import React, { useState, useEffect } from 'react';
import { 
  Play, Settings, Image as ImageIcon, CheckCircle2, Circle, MessageSquare, 
  Mic, Send, Paperclip, Moon, BarChart2, Sparkles, ExternalLink, Globe, 
  ShieldCheck, RefreshCw, AlertCircle, ArrowRight, Zap, Target
} from 'lucide-react';

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
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'neo'; text: string }>>([
    { sender: 'neo', text: "Hello! I'm NEO, your autonomous AI marketing agent. What campaign would you like to build or launch today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // 1. Fetch Meta Status & Ad Accounts
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

  // 2. Fetch Live Campaigns from Meta
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
  }, []);

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
        
        // Add chat feedback
        setChatMessages(prev => [
          ...prev,
          { sender: 'neo', text: `✨ I have generated a complete marketing campaign plan for "${productName}" with 3 high-converting copies and Meta targeting. Review and click "Launch to Meta Ads" when ready!` }
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
        setChatMessages(prev => [
          ...prev,
          { sender: 'neo', text: `🚀 Great news! Your Meta Campaign has been successfully published to Ad Account ${data.ad_account_id} with Campaign ID #${data.campaign_id}.` }
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
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'neo', text: `I understand! I'm analyzing your request: "${userMsg}". You can adjust parameters in the Campaign Studio on the left and click Generate to update your ads in real-time.` }
      ]);
    }, 600);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#07070b] text-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-6 bg-[#0c0c14] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black tracking-widest bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            KPILOT AI
          </h1>
          <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full font-bold border border-purple-500/20">
            AUTONOMOUS ENGINE
          </span>
        </div>

        {/* Agency / Client Account Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#14141e] border border-white/10 px-3.5 py-1.5 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-gray-400">Meta Agency:</span>
            <span className="font-bold text-white">{accountName || 'Vansh Jaat'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1"></span>
          </div>

          <button 
            onClick={() => { fetchStatus(); fetchCampaigns(); }}
            title="Refresh Status"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        
        {/* Left Studio Column */}
        <div className="flex-1 bg-[#0f0f18] rounded-2xl border border-white/5 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Ad Account Selector Bar */}
          <div className="bg-[#151522] border border-white/5 rounded-2xl p-5 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" /> CLIENT / AD ACCOUNT SELECTOR
                </span>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select an accessible Meta Ad Account or enter any client Ad Account ID.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!showCustomInput ? (
                  <>
                    <select 
                      value={selectedAdAccount}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setShowCustomInput(true);
                        } else {
                          handleSelectAccount(e.target.value);
                        }
                      }}
                      className="bg-[#1f1f2e] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {adAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({acc.id}) • {acc.currency}
                        </option>
                      ))}
                      <option value="__custom__">+ Enter Custom Client Ad Account ID</option>
                    </select>
                  </>
                ) : (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                      type="text"
                      placeholder="e.g. act_1441161704572702"
                      value={customAdAccountInput}
                      onChange={(e) => setCustomAdAccountInput(e.target.value)}
                      className="bg-[#1f1f2e] border border-purple-500/50 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400 w-48"
                    />
                    <button 
                      onClick={() => handleSelectAccount(customAdAccountInput)}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-colors"
                    >
                      Link
                    </button>
                    <button 
                      onClick={() => setShowCustomInput(false)}
                      className="text-gray-400 hover:text-white text-xs px-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form & AI Campaign Generator */}
          <div className="bg-[#151522] border border-purple-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> CLOUD AI CAMPAIGN STUDIO
                </span>
                <h2 className="text-xl font-bold text-white mt-1">Autonomous Meta Campaign Generator</h2>
              </div>
              
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-60"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                {isGenerating ? 'AI Generating Plan...' : 'Generate with Cloud AI'}
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Product / Offer Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g. Whey Protein Isolate"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Target Audience & Location</label>
                <input 
                  type="text" 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g. Fitness lovers, Gym goers in India"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Daily Budget (₹ INR)</label>
                <input 
                  type="number" 
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full bg-[#1c1c2b] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Campaign Objective</label>
                <select 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="OUTCOME_SALES">Sales / Conversions (OUTCOME_SALES)</option>
                  <option value="OUTCOME_LEADS">Lead Generation (OUTCOME_LEADS)</option>
                  <option value="OUTCOME_TRAFFIC">Website Traffic (OUTCOME_TRAFFIC)</option>
                </select>
              </div>
            </div>

            {/* AI Generated Strategy & Copies */}
            {generatedData && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Target className="w-4 h-4" /> AI Strategy & Copy Variations
                  </h3>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                    Estimated Reach: {generatedData.estimated_reach}
                  </span>
                </div>

                {/* Primary Text Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">Select Primary Ad Copy:</label>
                  <div className="space-y-2">
                    {generatedData.primary_texts.map((text: string, i: number) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedPrimaryText(text)}
                        className={`p-3 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all ${
                          selectedPrimaryText === text 
                            ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md' 
                            : 'bg-[#1b1b2a] border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Headline Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-2">Select Headline:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {generatedData.headlines.map((hl: string, i: number) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedHeadline(hl)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer text-center transition-all ${
                          selectedHeadline === hl 
                            ? 'bg-purple-950/40 border-purple-500 text-purple-200' 
                            : 'bg-[#1b1b2a] border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {hl}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Launch Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    Ready to launch on Meta Ad Account: <span className="font-bold text-white">{selectedAdAccount}</span>
                  </div>

                  <button 
                    onClick={handlePublishToMeta}
                    disabled={isPublishing}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 disabled:opacity-60"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {isPublishing ? 'Publishing to Meta Ads...' : '1-Click Launch to Meta'}
                  </button>
                </div>
              </div>
            )}

            {/* Error or Success Feedback */}
            {publishError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{publishError}</p>
              </div>
            )}

            {publishedResult && (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Campaign Published Live to Meta!
                  </span>
                  <a 
                    href={publishedResult.ads_manager_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-bold underline flex items-center gap-1"
                  >
                    View in Meta Ads Manager <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-gray-400">
                  Meta Campaign ID: <span className="font-mono text-white font-bold">#{publishedResult.campaign_id}</span> • Status: <span className="font-bold uppercase text-emerald-400">{publishedResult.status}</span>
                </p>
              </div>
            )}
          </div>

          {/* Live Meta Campaigns List */}
          <div className="bg-[#151522] border border-white/5 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" /> Active Meta Campaigns on {selectedAdAccount || 'Account'}
              </h3>
              <span className="text-xs text-gray-400 font-semibold">
                Total: {liveCampaigns.length}
              </span>
            </div>

            {liveCampaigns.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4 text-center">No campaigns launched yet. Click "Generate with Cloud AI" above to launch your first ad!</p>
            ) : (
              <div className="space-y-2">
                {liveCampaigns.map((c, i) => (
                  <div key={c.id || i} className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b2a] border border-white/5 text-xs">
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">ID: #{c.id} • Goal: {c.objective}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Assistant Column (NEO AI) */}
        <div className="w-[360px] bg-[#0c0c14] flex flex-col rounded-2xl overflow-hidden border border-purple-500/20 shrink-0 relative">
          
          <div className="h-14 flex items-center justify-between px-4 bg-[#12121e] border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2.5 font-bold text-sm text-white">
              <div className="w-7 h-7 bg-purple-600/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span>NEO Assistant</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Online</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-[#181826] border border-white/5 text-gray-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-[#12121e] border-t border-white/5 shrink-0">
            <div className="flex items-center gap-2 bg-[#1b1b2a] rounded-xl px-3 py-2 border border-white/10 focus-within:border-purple-500">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask NEO to create or tweak ads..."
                className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none"
              />
              <button type="submit" className="text-purple-400 hover:text-purple-300">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Image as ImageIcon, BarChart2, Moon, Paperclip, 
  Volume2, Mic, Send, ChevronDown, Plus, Sparkles, RefreshCw, 
  Download, ArrowRight, X, Maximize2, Columns, TrendingUp,
  Activity, DollarSign, Users, Eye, MousePointer, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Neo() {
  const navigate = useNavigate();

  // User Profile
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('K');
  const [userEmail, setUserEmail] = useState('');

  // Mode & Session Controls
  const [sessionName, setSessionName] = useState('No analytics sessions yet.');
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'campaign' | 'pixeo' | 'analytics'>('analytics');
  
  // Analytics & Report State
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // Chat & AI State
  const [isNeoPanelOpen, setIsNeoPanelOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Connecting voice channel...');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Chat conversation matching screenshot
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'neo';
    text: string;
    time?: string;
  }>>([
    {
      id: '1',
      sender: 'user',
      text: 'Analytics Generate a comprehensive performance report for the current campaign, including traffic metrics from Meta and Google.'
    }
  ]);

  // Fetch logged in user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/auth/me', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
        if (data.initial) setUserInitial(data.initial);
        if (data.email) setUserEmail(data.email);
      })
      .catch(err => console.error(err));
  }, []);

  const handleGenerateReport = (customQuery?: string) => {
    setIsAnalyzing(true);
    const query = customQuery || 'Show conversion trends and ROAS breakdown for the last 30 days.';
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: query
      }
    ]);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasGeneratedReport(true);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'neo',
          text: `📊 Performance report ready! Your Meta campaigns generated 1,420 conversions at an average ROAS of 3.82x. CTR is up +18.4% with top performance from Organic Whey creatives.`
        }
      ]);
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');
    handleGenerateReport(userText);
  };

  return (
    <div className="flex flex-col h-screen bg-[#07070c] text-white overflow-hidden select-none font-sans">
      
      {/* ================= 1. TOP GLOBAL HEADER BAR ================= */}
      <header className="h-14 px-5 sm:px-6 bg-[#090912] border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white">NEO</h1>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Theme Switcher Pill */}
          <button className="w-10 h-6 rounded-full bg-[#161626] border border-white/10 flex items-center px-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Moon className="w-3.5 h-3.5 text-gray-300" />
          </button>

          {/* User Initial Avatar (Exact orange circle matching screenshot) */}
          <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-600/30">
            {userInitial}
          </div>
        </div>
      </header>

      {/* ================= 2. SUBHEADER / TOOLBAR ================= */}
      <div className="h-14 px-5 sm:px-6 bg-[#090912] border-b border-white/5 flex items-center justify-between shrink-0 z-10">
        
        {/* Left: Analytics Workspace & Project ID */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3.5 bg-gray-300 rounded-full"></span>
              <span className="w-1 h-3.5 bg-gray-300 rounded-full"></span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-white leading-tight">Analytics Workspace</span>
            <span className="text-[11px] text-gray-400 font-mono">project-2481</span>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Session Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12121f] hover:bg-white/5 border border-white/10 text-xs text-gray-300 transition-colors cursor-pointer"
            >
              <span>{sessionName}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isSessionDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#161528] border border-white/10 rounded-xl p-1.5 shadow-2xl z-50">
                <button
                  onClick={() => {
                    setSessionName('Q1 2026 Growth Diagnostics');
                    setHasGeneratedReport(true);
                    setIsSessionDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-gray-200"
                >
                  Q1 2026 Growth Diagnostics
                </button>
                <button
                  onClick={() => {
                    setSessionName('Meta Ads Conversion Audit');
                    setHasGeneratedReport(true);
                    setIsSessionDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-gray-200"
                >
                  Meta Ads Conversion Audit
                </button>
                <div className="h-px bg-white/5 my-1"></div>
                <button
                  onClick={() => {
                    setSessionName('No analytics sessions yet.');
                    setHasGeneratedReport(false);
                    setIsSessionDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-purple-400 hover:bg-purple-500/10"
                >
                  + Start New Analysis
                </button>
              </div>
            )}
          </div>

          {/* New Analysis Button */}
          <button
            onClick={() => handleGenerateReport()}
            className="px-4 py-1.5 rounded-full bg-[#161528] hover:bg-[#201f38] border border-white/15 text-white text-xs font-medium transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>New analysis</span>
          </button>
        </div>
      </div>

      {/* ================= 3. MAIN WORKSPACE CONTAINER ================= */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 bg-[#07070c]">
        
        {/* ================= LEFT / MAIN ANALYTICS STUDIO ================= */}
        <div className="flex-1 flex flex-col bg-[#0a0a12] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Main Analytics Canvas Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            
            {!hasGeneratedReport ? (
              /* Centered Card matching media_1791610762319.png */
              <div className="w-full max-w-lg bg-[#11111e]/90 border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
                
                {/* Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-900/30">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>

                {/* Tag */}
                <span className="text-[11px] font-bold tracking-widest text-[#818cf8] uppercase font-mono block mb-2">
                  ANALYTICS
                </span>

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  Ask your first analytics question
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
                  Analyze performance, compare campaigns, and diagnose trends.
                </p>

                {/* Suggestion Pill Button */}
                <div className="mb-6">
                  <button
                    onClick={() => handleGenerateReport('Show conversion trends for the last 30 days.')}
                    className="px-4 py-2 rounded-full bg-[#181628] hover:bg-[#201d36] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer shadow-sm"
                  >
                    Try: "Show conversion trends for the last 30 days."
                  </button>
                </div>

                {/* Primary CTA Button */}
                <div>
                  <button
                    onClick={() => handleGenerateReport()}
                    disabled={isAnalyzing}
                    className="px-8 py-3 rounded-full bg-[#5b3af6] hover:bg-[#4f2ee8] text-white text-sm font-semibold shadow-xl shadow-indigo-600/40 transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAnalyzing ? 'Generating Insights...' : 'Generate report'}</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Live Analytics Dashboard View */
              <div className="w-full space-y-6 animate-in fade-in duration-300">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#121122] border border-white/10">
                    <span className="text-xs text-gray-400">Total Spend</span>
                    <h4 className="text-xl font-bold text-white mt-1">₹42,500</h4>
                    <span className="text-[11px] text-emerald-400 font-medium">+12.4% vs last period</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#121122] border border-white/10">
                    <span className="text-xs text-gray-400">Conversions</span>
                    <h4 className="text-xl font-bold text-white mt-1">1,420</h4>
                    <span className="text-[11px] text-emerald-400 font-medium">+24.1% high intent</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#121122] border border-white/10">
                    <span className="text-xs text-gray-400">Average ROAS</span>
                    <h4 className="text-xl font-bold text-purple-400 mt-1">3.82x</h4>
                    <span className="text-[11px] text-purple-300 font-medium">Top Tier Performance</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#121122] border border-white/10">
                    <span className="text-xs text-gray-400">Avg. CTR</span>
                    <h4 className="text-xl font-bold text-white mt-1">3.18%</h4>
                    <span className="text-[11px] text-emerald-400 font-medium">+0.8% benchmark</span>
                  </div>
                </div>

                {/* Chart Visualization Container */}
                <div className="p-6 rounded-2xl bg-[#121122] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Conversion & Revenue Velocity (30 Days)</h4>
                      <p className="text-xs text-gray-400">Meta Graph API real-time attribution</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Live Synced
                    </span>
                  </div>

                  {/* Synthetic bar chart visual */}
                  <div className="h-44 flex items-end gap-2 pt-4 border-b border-white/5">
                    {[35, 45, 60, 52, 75, 88, 94, 82, 100, 91, 115, 128, 140].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div
                          style={{ height: `${(val / 140) * 100}%` }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all"
                        />
                        <span className="text-[9px] text-gray-500 font-mono">D{idx * 2 + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Diagnoses & Action Plan */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 font-mono">AI Recommendation</span>
                    <p className="text-xs sm:text-sm text-gray-200 font-medium">
                      Scale daily budget on "Organic Whey Isolate" by +25% — marginal CPA remains ₹29.80.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/xeno')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Apply to Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* ================= BOTTOM NAVIGATION: 3 SEGMENTED CONTROL ================= */}
          <div className="p-2 sm:p-2.5 border-t border-white/5 bg-[#07070d] shrink-0">
            <div className="w-full bg-[#0d0d16] border border-white/10 rounded-2xl p-1 grid grid-cols-3 gap-1 shadow-inner">
              
              {/* Tab 1: Campaign */}
              <button
                onClick={() => navigate('/xeno')}
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

              {/* Tab 3: Analytics (Active) */}
              <button
                onClick={() => setActiveBottomTab('analytics')}
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
            
            {/* Header: NEO title, Split view & Close button */}
            <div className="h-14 flex items-center justify-between px-4 bg-[#0b0b14] border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white tracking-wide">NEO</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400">
                <button className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
                  <Columns className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsNeoPanelOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Conversation Canvas (Dot Grid Matrix Background) */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 relative bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#5b3af6] text-white rounded-br-none shadow-md'
                        : 'bg-[#141422] text-gray-200 border border-white/10 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              <div ref={chatBottomRef} />
            </div>

            {/* Connecting Voice Channel Notice Bar */}
            <div className="px-3 py-2 bg-[#090912] border-t border-white/5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11111f] border border-white/10 text-[11px] text-gray-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{voiceStatus}</span>
              </div>
            </div>

            {/* Chat Input Container matching media_1791610762319.png */}
            <div className="p-3 bg-[#090912] border-t border-white/5 shrink-0">
              <form onSubmit={handleSendMessage} className="space-y-2.5">
                <div className="bg-[#0e0d19] border border-white/10 rounded-2xl p-3 focus-within:border-purple-500 transition-all">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    rows={2}
                    placeholder="Ask NEO to launch, create, or analyze"
                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none resize-none px-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl bg-[#141324] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl bg-[#141324] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-9 h-9 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

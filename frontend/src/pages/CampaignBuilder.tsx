import React, { useState, useEffect } from 'react';
import { Play, Settings, Image as ImageIcon, CheckCircle, Circle, MessageSquare, Mic, Send, Paperclip, Moon, BarChart2 } from 'lucide-react';

export default function CampaignBuilder() {
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetch('/api/meta/status')
      .then(res => res.json())
      .then(data => setIsMetaConnected(data.connected))
      .catch(err => console.error(err));
  }, []);

  
  const handleDisconnect = async () => {
    try {
      await fetch('/api/meta/disconnect', { method: 'POST' });
      setIsMetaConnected(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/meta/connect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsMetaConnected(true);
      }
    } catch (err) {
      console.error(err);
    }
    setIsConnecting(false);
  };

  const steps = [
    { title: 'Campaign Details', desc: 'Capturing campaign details', status: 'CAPTURING', active: true },
    { title: 'Campaign Planning', desc: 'Build the campaign structure', status: '', active: false },
    { title: 'Creative Generation', desc: 'Generate creative direction', status: '', active: false },
    { title: 'Ad Preview', desc: 'Prepare ads and messaging', status: '', active: false },
    { title: 'Launch', desc: 'Review and publish the campaign', status: '', active: false },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#050508] text-white overflow-hidden">
      
      {/* Top Global Bar (from screenshot) */}
      <div className="h-16 flex items-center justify-between px-6 bg-[#050508] border-b border-white/5 shrink-0">
        <h1 className="text-xl font-bold tracking-widest text-white">XENO</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Moon className="w-4 h-4" />
            </button>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
            K
          </div>
        </div>
      </div>

      {/* Campaign Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#141419] shrink-0">
        <div className="flex items-center gap-4">
          
          <div>
            <h2 className="text-lg font-bold text-white">Campaign Workspace</h2>
            <p className="text-xs text-gray-400">project-2481</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-[#1c1c22] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none">
            <option>No campaigns yet.</option>
          </select>
          <button className="bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            New campaign
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        
        {/* Left Column - Stepper */}
        <div className="w-[320px] flex flex-col bg-[#141419] rounded-2xl border border-white/5 overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {steps.map((step, i) => (
              <div key={i} className={`p-4 rounded-2xl border transition-all relative ${step.active ? 'bg-purple-900/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-transparent border-white/5'}`}>
                {step.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-purple-500 rounded-r-md"></div>
                )}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${step.active ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-white/10 text-gray-500 bg-black/20'}`}>
                    {step.active ? (
                      <div className="relative flex items-center justify-center">
                        <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                        <span className="absolute w-full h-full bg-purple-500 rounded-full animate-ping opacity-20"></span>
                      </div>
                    ) : i + 1}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${step.active ? 'text-purple-400' : 'text-gray-300'}`}>{step.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                    {step.status && (
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                        {step.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Tabs */}
          <div className="flex border-t border-white/5 bg-[#1a1a24] p-1">
            <button className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-[#7c3aed] text-white py-2 rounded-xl shadow-lg shadow-purple-500/20">
              <Play className="w-4 h-4" fill="currentColor" />
              <span className="text-[11px] font-bold">Campaign</span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-white py-2 rounded-xl transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Pixeo</span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-white py-2 rounded-xl transition-colors">
              <BarChart2 className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Analytics</span>
            </button>
          </div>
        </div>

        {/* Middle Column - Workspace */}
        <div className="flex-1 bg-[#0a0a0f] rounded-2xl border border-white/5 overflow-y-auto p-8 relative">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Readiness Card */}
            <div className="bg-[#141419] border border-purple-500/20 rounded-3xl p-8 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-wider mb-3">LAUNCH READINESS</p>
                  <h3 className="text-2xl font-bold text-white mb-2">Are you ready to launch your campaign?</h3>
                  <p className="text-sm text-gray-400">
                    {isMetaConnected 
                      ? "Your Meta Ad accounts are securely connected." 
                      : "We couldn't check your ad accounts right now."}
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${isMetaConnected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0a0a0f] border-white/10 text-gray-300'}`}>
                  <span className={`w-2 h-2 rounded-full ${isMetaConnected ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                  {isMetaConnected ? 'Ready' : 'Unknown'}
                </div>
                {isMetaConnected && (
                  <button onClick={handleDisconnect} className="text-xs text-red-400 hover:text-red-300 underline ml-3 font-semibold mt-2">
                    Disconnect to test again
                  </button>
                )}
              </div>
              
              {!isMetaConnected && (
                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-purple-500/25"
                >
                  {isConnecting ? 'Connecting...' : 'Connect ad accounts'}
                </button>
              )}
            </div>

            {/* Draft Card */}
            <div className="bg-[#141419] border border-white/5 rounded-3xl p-8 border-dashed border-gray-700/50">
              <div className="flex gap-5 mb-6">
                <div className="w-12 h-12 rounded-full bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-wider mb-2">NEW CAMPAIGN</p>
                  <h3 className="text-2xl font-bold text-white mb-2">Draft not started yet</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Start a fresh campaign from chat or pick an existing project from the project list.</p>
                </div>
              </div>
              
              <div className="flex gap-3 pl-[68px]">
                <button className="px-5 py-2 rounded-full bg-[#0a0a0f] border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                  Open chat
                </button>
                <button className="px-5 py-2 rounded-full bg-[#0a0a0f] border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                  Projects
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Column - NEO Chat */}
        <div className="w-[360px] bg-[#0a0a0f] flex flex-col rounded-2xl overflow-hidden border border-[#7c3aed]/20 shrink-0 relative">
          
          {/* Chat Header */}
          <div className="h-16 flex items-center justify-between px-5 bg-[#0a0a0f] shrink-0 z-10 border-b border-white/5">
            <div className="flex items-center gap-3 font-bold text-sm text-white">
              <div className="w-8 h-8 bg-[#7c3aed]/20 rounded-xl flex items-center justify-center border border-[#7c3aed]/30">
                <MessageSquare className="w-4 h-4 text-[#7c3aed]" />
              </div>
              NEO
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"><Settings className="w-4 h-4 text-gray-400" /></button>
              <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"><span className="text-gray-400 text-lg leading-none mb-1"></span></button>
            </div>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 p-4 relative z-0" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff10 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            {/* The dot background fills this area */}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-[#0a0a0f] shrink-0 z-10">
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#141419] focus-within:border-[#7c3aed]/50 transition-colors">
              <textarea 
                placeholder="Ask NEO to launch, create, or analyze"
                className="w-full bg-transparent p-4 text-sm text-white placeholder-gray-500 outline-none resize-none h-20"
              />
              <div className="flex items-center justify-between p-2">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <button className="p-2 text-[#7c3aed] bg-[#7c3aed]/10 rounded-xl hover:bg-[#7c3aed]/20 transition-colors"><Mic className="w-4 h-4" /></button>
                </div>
                <button className="p-2 text-white bg-[#7c3aed] rounded-xl hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/25"><Send className="w-4 h-4 ml-[-2px]" /></button>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
 


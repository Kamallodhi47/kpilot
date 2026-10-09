import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Minimize2, Check, RefreshCw } from 'lucide-react';

interface AIAssistantWidgetProps {
  currentAdAccount?: string | null;
  onApplyRecommendation?: (text: string) => void;
}

export default function AIAssistantWidget({ currentAdAccount }: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time?: string }>>([
    {
      sender: 'ai',
      text: `Hello! I'm your AI Marketing Copilot. I can analyze your ad performance, generate creative strategies, or optimize your Meta ad spend. How can I help you today?`,
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    "🚀 Scale high ROAS ad set",
    "🎨 Suggest creative hooks",
    "🎯 Best audiences for e-commerce",
    "⚡ Audit budget leakages"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Simulate intelligent marketing response based on the query
      setTimeout(() => {
        let aiReply = "Analyzing your campaign data across Meta...";
        const lower = text.toLowerCase();
        if (lower.includes("scale") || lower.includes("budget") || lower.includes("roas")) {
          aiReply = "💡 **Budget Optimization Insight**: Top performing campaign 'Fitness Promo' has a ROAS of 3.8x with low CPA (₹140). Recommendation: Increase daily budget from ₹1,000 to ₹1,200 (+20%) at 12:00 AM to maintain algorithm stability.";
        } else if (lower.includes("creative") || lower.includes("hook") || lower.includes("copy")) {
          aiReply = "🎨 **Creative Hook Recommendation**:\n1. 'Stop wasting ₹₹ on ordinary products – here's the science-backed solution.'\n2. 'Rated 4.9/5 by 12,000+ Indian buyers. Limited stock remaining.'\n3. 'Why top athletes are switching to this in 2026.'";
        } else if (lower.includes("audience") || lower.includes("targeting")) {
          aiReply = "🎯 **Audience Recommendation**: Combine 'Lookalike (Purchasers 1%)' with Layered Interests: 'Gym & Fitness', 'Nutrition', and 'Online Shopping (India)'. Age filter: 22-38.";
        } else {
          aiReply = `🤖 I've analyzed your account (${currentAdAccount || 'Meta Ad Account'}). Your overall click-through rate (CTR) is healthy at 2.4%. Try testing carousel creatives to decrease Cost Per Click by up to ~15%.`;
        }

        setMessages(prev => [...prev, {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 700);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Robot Icon Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-900 via-[#18122B] to-purple-600 p-[2px] shadow-2xl shadow-purple-600/50 hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-subtle"
            title="Open AI Marketing Assistant"
          >
            {/* Glowing Ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
            
            {/* Cute Robot Head Icon */}
            <div className="relative w-full h-full rounded-full bg-[#0d091a] flex items-center justify-center border border-purple-400/30 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-md">
                {/* Antenna */}
                <circle cx="50" cy="16" r="5" fill="#a855f7" className="animate-ping opacity-75" />
                <circle cx="50" cy="16" r="4" fill="#c084fc" />
                <line x1="50" y1="20" x2="50" y2="30" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                
                {/* Head */}
                <rect x="22" y="30" width="56" height="46" rx="14" fill="#1f1833" stroke="#8b5cf6" strokeWidth="2.5" />
                {/* Screen Visor */}
                <rect x="28" y="38" width="44" height="28" rx="8" fill="#0b0816" stroke="#6366f1" strokeWidth="1.5" />
                {/* Glowing Eyes */}
                <ellipse cx="40" cy="51" rx="4.5" ry="5.5" fill="#a855f7" />
                <circle cx="41.5" cy="49" r="1.5" fill="#ffffff" />
                
                <ellipse cx="60" cy="51" rx="4.5" ry="5.5" fill="#a855f7" />
                <circle cx="61.5" cy="49" r="1.5" fill="#ffffff" />
                {/* Cute smirk mouth */}
                <path d="M46 59 Q50 63 56 60" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
                {/* Ears */}
                <rect x="16" y="46" width="6" height="14" rx="3" fill="#6366f1" />
                <rect x="78" y="46" width="6" height="14" rx="3" fill="#6366f1" />
              </svg>

              {/* Online Dot */}
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#0d091a]"></span>
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Interactive AI Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] max-h-[600px] h-[85vh] bg-[#0d0d14]/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-purple-950/40 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">AI Marketing Copilot</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Live</span>
                </div>
                <p className="text-[11px] text-gray-400">Autonomous Optimization & Strategy</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-black/20 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[11px] transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/20">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#7c3aed] text-white rounded-br-none shadow-md shadow-purple-600/20'
                      : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
                {msg.time && (
                  <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-purple-400 text-xs py-2 bg-purple-500/5 px-3 rounded-xl border border-purple-500/10 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI is analyzing marketing data...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-black/30 border-t border-white/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-purple-500/50 transition-all"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI to optimize, write hooks, analyze..."
                className="flex-1 bg-transparent text-xs sm:text-sm text-white focus:outline-none placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}

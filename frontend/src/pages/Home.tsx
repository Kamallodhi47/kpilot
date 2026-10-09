import React, { useState, useEffect } from 'react';
import { Mic, Send, Star, Moon, Target, Image as ImageIcon, BarChart2, Lightbulb, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('U');
  const [userEmail, setUserEmail] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  useEffect(() => {
    // Fetch logged-in user profile dynamically
    fetch('/api/auth/me', {
      headers: { ...getAuthHeader() }
    })
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
        if (data.initial) setUserInitial(data.initial);
        if (data.email) setUserEmail(data.email);
      })
      .catch(err => {
        console.error("Failed to fetch user profile:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLaunchPrompt = (textToLaunch?: string) => {
    const query = textToLaunch || promptInput;
    if (!query.trim()) return;
    // Navigate to campaign builder or AI processing with preloaded prompt
    navigate('/build', { state: { initialPrompt: query } });
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setPromptInput("Launch a high-converting Meta Ad Campaign for Protein Solution");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0f] text-white rounded-2xl relative overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex justify-between items-center p-6 sm:p-8 z-20 relative">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Welcome to NYX, <span className="text-white">{userName}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Let's start a new project</p>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/build')}
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            Start 7-day free trial
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
            Take a tour
          </button>

          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Theme">
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* DYNAMIC USER AVATAR & DROPDOWN MENU */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white font-bold text-base shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all ring-2 ring-white/10"
              title={userEmail ? `Logged in as ${userEmail}` : 'User Profile'}
            >
              {userInitial}
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-[#12121c] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{userEmail || userName}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-purple-400" />
                    Dashboard & Workspace
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 relative pb-16">
        
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mb-8 sm:mb-10 text-center tracking-tight font-sans">
          What will you create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">today?</span>
        </h2>

        {/* Big Interactive Input Box */}
        <div className="w-full max-w-4xl relative mb-8 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 opacity-25 rounded-2xl blur-md group-hover:opacity-50 transition duration-500"></div>
          
          <div className="relative bg-[#07070c] border border-purple-500/30 rounded-2xl p-5 min-h-[170px] flex flex-col justify-between shadow-2xl">
            <textarea 
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleLaunchPrompt();
                }
              }}
              className="w-full bg-transparent resize-none outline-none text-base sm:text-lg text-white p-1 placeholder-gray-500 scrollbar-none"
              placeholder="Launch a retargeting campaign for weekend site visitors..."
              rows={3}
            />

            <div className="flex justify-between items-end pt-3">
              <button 
                onClick={toggleMic}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button 
                onClick={() => handleLaunchPrompt()}
                disabled={!promptInput.trim()}
                className="w-10 h-10 rounded-full bg-[#7c3aed] hover:bg-purple-500 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-lg shadow-purple-500/40 hover:scale-105 active:scale-95 cursor-pointer"
                title="Send Prompt"
              >
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8 max-w-4xl">
          <button 
            onClick={() => navigate('/build')}
            className="flex items-center gap-2 bg-black/50 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs transition-all hover:scale-105"
          >
            <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400"><Target className="w-3 h-3" /></span>
            <span className="font-bold text-white">Xeno</span>
            <span className="text-gray-400">- Launch autonomous campaigns</span>
          </button>

          <button 
            onClick={() => navigate('/processing')}
            className="flex items-center gap-2 bg-black/50 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs transition-all hover:scale-105"
          >
            <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><ImageIcon className="w-3 h-3" /></span>
            <span className="font-bold text-white">Pixeo</span>
            <span className="text-gray-400">- Generate creatives</span>
          </button>

          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-black/50 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs transition-all hover:scale-105"
          >
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><BarChart2 className="w-3 h-3" /></span>
            <span className="font-bold text-white">Analytics</span>
            <span className="text-gray-400">- Chat with your data</span>
          </button>

          <button 
            onClick={() => navigate('/optimise')}
            className="flex items-center gap-2 bg-black/50 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs transition-all hover:scale-105"
          >
            <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400"><Lightbulb className="w-3 h-3" /></span>
            <span className="font-bold text-white">Recommendations</span>
            <span className="text-gray-400">- Know what to do next</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
          <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">TRY:</span>
          
          {[
            "Launch my next campaign autonomously",
            "Generate creatives for a new launch",
            "What should I focus on this week?"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(suggestion);
                handleLaunchPrompt(suggestion);
              }}
              className="px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/50 text-gray-400 hover:text-white transition-all bg-black/40 hover:bg-purple-950/20 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>

      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Mic, Send, Star, Moon, Target, Image as ImageIcon, BarChart2, Lightbulb, LogOut, User as UserIcon, Sparkles, Folder, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('U');
  const [userEmail, setUserEmail] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string>('Launch my next campaign autonomously');
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
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

    // Fetch recent campaigns/projects
    setIsLoadingProjects(true);
    fetch('/api/meta/campaigns', {
      headers: { ...getAuthHeader() }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setRecentProjects(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch campaigns:", err))
      .finally(() => setIsLoadingProjects(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLaunchPrompt = (textToLaunch?: string) => {
    const query = textToLaunch || promptInput;
    if (!query.trim()) return;
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
    <div className="h-full w-full flex flex-col bg-[#0a0a0f] text-white rounded-2xl relative overflow-y-auto scrollbar-none animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex justify-between items-center p-6 sm:p-8 z-20 relative shrink-0">
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

      {/* Main Prompt & Center Section */}
      <div className="flex flex-col items-center justify-center px-4 z-10 relative pt-4 pb-8">
        
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-center tracking-tight font-sans">
          What will you create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">today?</span>
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
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs mb-12">
          <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">TRY:</span>
          
          {[
            "Launch my next campaign autonomously",
            "Generate creatives for a new launch",
            "What should I focus on this week?"
          ].map((suggestion, idx) => {
            const isSelected = activeSuggestion === suggestion;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveSuggestion(suggestion);
                  setPromptInput(suggestion);
                }}
                className={`px-4 py-2 rounded-full text-xs transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#8b5cf6] text-white font-medium shadow-purple-500/30'
                    : 'border border-white/10 hover:border-purple-500/50 text-gray-400 hover:text-white bg-black/40 hover:bg-purple-950/20'
                }`}
              >
                {suggestion}
              </button>
            );
          })}
        </div>

      </div>

      {/* YOUR RECENT PROJECTS SECTION - Exact match to screenshot */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-10 z-10 relative">
        
        {/* Section Header with Purple Vertical Indicator */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-1 h-5 bg-[#8b5cf6] rounded-full" />
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
            Your Recent Projects
          </h3>
        </div>

        {/* Projects Container (Dashed border box matching screenshot) */}
        {recentProjects.length === 0 ? (
          <div className="w-full border border-dashed border-white/10 rounded-2xl py-12 px-6 flex items-center justify-center bg-black/20">
            <p className="text-gray-500 text-sm font-normal">
              No recent projects found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((proj, idx) => (
              <div 
                key={idx}
                onClick={() => navigate('/dashboard')}
                className="bg-[#0f0f18] border border-white/10 hover:border-purple-500/40 rounded-2xl p-4 transition-all cursor-pointer group hover:bg-[#141322]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Folder className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    proj.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {proj.status}
                  </span>
                </div>
                <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors truncate">
                  {proj.name}
                </h4>
                <p className="text-gray-400 text-xs mt-1 font-mono">
                  {proj.objective}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
                  <span>Meta ID: {proj.id?.slice(-6)}</span>
                  <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    View <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WHAT'S NEW AT NYX? SECTION - Exact match to screenshot */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-16 z-10 relative">
        {/* Section Header with Purple Vertical Indicator */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-1 h-5 bg-[#8b5cf6] rounded-full" />
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
            What's New at NYX?
          </h3>
        </div>

        {/* Featured PIXEO Card */}
        <div className="bg-[#12111d] border border-white/10 hover:border-purple-500/30 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group transition-all">
          
          {/* Left Text Content */}
          <div className="flex-1 z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400 block mb-3 font-mono">
              PIXEO
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-3 font-sans">
              Create scroll-stopping ad creatives
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Describe what you need and Pixeo generates on-brand ad images in minutes — ready to launch across every channel.
            </p>
            <div className="relative inline-block group/btn">
              {/* Button Ambient Purple Glow */}
              <div className="absolute -inset-1 rounded-full bg-purple-600/40 blur-md opacity-70 group-hover/btn:opacity-100 transition-opacity" />
              <button
                onClick={() => navigate('/processing')}
                className="relative inline-flex items-center gap-2 bg-[#17152b] hover:bg-[#201d3a] border border-purple-500/50 text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-inner"
              >
                <span>Try It Now</span>
                <span className="text-base font-bold text-purple-300">→</span>
              </button>
            </div>
          </div>

          {/* Right Visual Robot on Bench Image */}
          <div className="w-full lg:w-[460px] shrink-0 z-10 relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl aspect-[16/10] bg-[#070710] flex items-center justify-center group-hover:border-purple-500/40 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop" 
                alt="PIXEO AI Robot Ad Creative" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              {/* Subtle Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
              
              {/* Badge: AI Creative V3 */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-purple-400/40 text-[11px] text-purple-300 font-mono shadow-md">
                <Sparkles className="w-3 h-3 text-purple-400" /> AI Creative V3
              </div>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}

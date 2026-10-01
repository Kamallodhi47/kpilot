import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Layout, Zap, Rocket, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Animated Flowing Background */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[20%] left-[-10%] w-[120%] h-[400px] opacity-30 nyx-wave-1 ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_center,rgba(91,62,191,0.4)_0%,transparent_70%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(91,62,191,0.2)_0%,transparent_70%)]'}`}></div>
        <div className={`absolute top-[30%] left-[-10%] w-[120%] h-[300px] opacity-20 nyx-wave-2 ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,0,77,0.3)_0%,transparent_70%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(255,0,77,0.15)_0%,transparent_70%)]'}`}></div>
        
        {/* SVG Flowing Lines */}
        <svg className="absolute w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="none" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="0.5" className="nyx-svg-wave" />
          <path d="M0,60 Q25,80 50,60 T100,60 L100,100 L0,100 Z" fill="none" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="0.5" className="nyx-svg-wave-2" />
          <path d="M0,40 Q25,20 50,40 T100,40 L100,100 L0,100 Z" fill="none" stroke={theme === 'dark' ? "rgba(144,0,255,0.05)" : "rgba(144,0,255,0.05)"} strokeWidth="0.5" className="nyx-svg-wave-3" />
        </svg>
      </div>

      {/* Demo Video Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-[#5b3ebf] text-white py-4 px-2 rounded-l-xl cursor-pointer hover:bg-[#4a3299] transition-colors shadow-lg shadow-[#5b3ebf]/20 flex items-center justify-center writing-vertical">
          <span className="nyx-font-heading text-xs font-bold tracking-widest uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>Demo Video</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0f]/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="nyx-font-heading text-3xl font-black tracking-widest nyx-gradient-text">
              NYX
            </Link>
            
            {/* Center Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className={`flex items-center gap-1 text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                Products <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className={`flex items-center gap-1 text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                Solutions <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Pricing</a>
              <a href="#" className={`flex items-center gap-1 text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                Resources <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="text-xl p-2 rounded-full hover:bg-gray-500/20 transition-colors">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className={`hidden sm:block px-6 py-2 rounded-full text-sm font-bold transition-colors border ${theme === 'dark' ? 'border-white/20 text-white hover:bg-white/10' : 'border-black/20 text-black hover:bg-black/5'}`}>
                Login
              </Link>
              <Link to="/login" className="nyx-btn-glow bg-gradient-to-r from-[#6b4eff] to-[#9d50ff] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(107,78,255,0.6)] transition-all">
                Start 7 days trial →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center text-center px-4 z-10">
        
        <h1 className={`nyx-font-heading text-5xl md:text-7xl lg:text-[6rem] font-bold leading-[1.1] tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Run marketing<br />
          <span className="nyx-gradient-text">with your <span className="nyx-font-serif italic font-normal text-[115%]">voice.</span></span>
        </h1>
        
        <p className={`text-lg md:text-xl mb-12 max-w-2xl font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Maximise ROI with NYX autonomous AI agents
        </p>
        
        <div>
          <Link to="/login" className="nyx-btn-glow bg-gradient-to-r from-[#6b4eff] to-[#9d50ff] text-white px-8 py-4 rounded-full text-base font-bold hover:shadow-[0_0_25px_rgba(107,78,255,0.6)] hover:-translate-y-1 transition-all inline-block">
            Start 7 days trial →
          </Link>
        </div>
      </header>

      {/* Marquee Section */}
      <section className="py-16 overflow-hidden text-center z-10 relative">
        <div className="flex items-center justify-center mb-10 max-w-xl mx-auto">
          <div className={`flex-1 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}></div>
          <span className={`px-4 nyx-font-heading text-xs font-bold tracking-[0.2em] uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            TRUSTED BY
          </span>
          <div className={`flex-1 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}></div>
        </div>
        
        <div className="w-full flex">
          <div className="nyx-marquee-track flex items-center">
            {[...Array(2)].map((_, j) => (
              <React.Fragment key={j}>
                <div className={`nyx-font-heading font-extrabold text-3xl tracking-wider mx-12 ${theme === 'dark' ? 'text-[#ff9900]' : 'text-[#e68a00]'}`}>oap</div>
                <div className={`nyx-font-heading font-bold text-xl tracking-widest mx-12 flex flex-col items-center ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                  <span className="text-2xl mb-1">🐰</span> RARE RABBIT
                </div>
                <div className={`nyx-font-heading font-black text-3xl tracking-widest mx-12 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>IKONIC<span className="text-[#ff004d]">®</span></div>
                <div className={`nyx-font-heading font-black text-4xl tracking-tighter italic mx-12 text-[#ff004d]`}>HRX</div>
                <div className={`nyx-font-heading font-bold text-3xl tracking-tight mx-12 ${theme === 'dark' ? 'text-[#ff6600]' : 'text-[#cc5200]'}`}>dishtv</div>
                <div className={`nyx-font-heading font-extrabold text-3xl mx-12 ${theme === 'dark' ? 'text-white/30' : 'text-black/30'}`}>V/X</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="nyx-font-heading text-4xl md:text-5xl font-bold">
            The autonomous <span className="nyx-gradient-text nyx-font-serif italic font-normal">marketing stack.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Rocket, name: 'Xeno', desc: 'Launch automated campaigns' },
            { icon: Layout, name: 'Pixeo', desc: 'Generate Ads' },
            { icon: Zap, name: 'Neo', desc: 'Get Insights and Recommendation' },
            { icon: Megaphone, name: 'Campulse', desc: 'Launch Co-Pilot Campaigns' },
          ].map((feature, i) => (
            <div key={i} className={`nyx-feature-card rounded-3xl p-8 border backdrop-blur-sm transition-all ${theme === 'dark' ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06]' : 'bg-white border-gray-200 hover:shadow-xl shadow-sm'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-[#5b3ebf]'}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="nyx-font-heading text-2xl font-bold mb-3">{feature.name}</h3>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

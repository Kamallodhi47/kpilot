import React from 'react';
import { Mic, Send, Star, PlayCircle, Moon, Target, Image as ImageIcon, BarChart2, Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0f] text-white rounded-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex justify-between items-center p-8 z-10 relative">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to NYX, Kamal</h1>
          <p className="text-sm text-gray-400 mt-1">Let's start a new project</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            Start 7-day free trial
          </button>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
            Take a tour
          </button>
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 relative pb-20">
        <h2 className="text-4xl font-bold mb-10">
          What will you create <span className="text-purple-500">today?</span>
        </h2>

        {/* Big Input Box */}
        <div className="w-full max-w-4xl relative mb-8 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-transparent opacity-20 rounded-2xl blur group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#050508] border border-purple-500/30 rounded-2xl p-4 min-h-[160px] flex flex-col justify-between">
            <textarea 
              className="w-full bg-transparent resize-none outline-none text-lg p-2 placeholder-gray-600"
              placeholder=""
              rows={4}
            />
            <div className="flex justify-between items-end">
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#7c3aed] hover:bg-purple-500 flex items-center justify-center text-white transition-colors shadow-lg shadow-purple-500/40">
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button className="flex items-center gap-2 bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs transition-colors">
            <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500"><Target className="w-3 h-3" /></span>
            <span className="font-bold">Xeno</span>
            <span className="text-gray-500">- Launch autonomous campaigns</span>
          </button>
          <button className="flex items-center gap-2 bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs transition-colors">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500"><ImageIcon className="w-3 h-3" /></span>
            <span className="font-bold">Pixeo</span>
            <span className="text-gray-500">- Generate creatives</span>
          </button>
          <button className="flex items-center gap-2 bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs transition-colors">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500"><BarChart2 className="w-3 h-3" /></span>
            <span className="font-bold">Analytics</span>
            <span className="text-gray-500">- Chat with your data</span>
          </button>
          <button className="flex items-center gap-2 bg-black/40 hover:bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs transition-colors">
            <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500"><Lightbulb className="w-3 h-3" /></span>
            <span className="font-bold">Recommendations</span>
            <span className="text-gray-500">- Know what to do next</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-500 font-bold uppercase tracking-widest">Try:</span>
          <button className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors bg-black/40">
            Launch my next campaign autonomously
          </button>
          <button className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors bg-black/40">
            Generate creatives for a new launch
          </button>
          <button className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors bg-black/40">
            What should I focus on this week?
          </button>
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}

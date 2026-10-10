import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Image as ImageIcon, BarChart2, Moon, Sun, Paperclip, 
  Volume2, Send, ChevronDown, Plus, Sparkles, RefreshCw, 
  Download, Upload, Check, Layers, ArrowRight, X, Minus,
  Sliders, Maximize2, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GeneratedImage {
  id: string;
  url: string;
  title: string;
  tag: string;
  aspectRatio: string;
  format: string;
}

export default function Pixeo() {
  const navigate = useNavigate();

  // User Profile
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('K');
  const [userEmail, setUserEmail] = useState('');

  // Mode & Session Controls
  const [isGuided, setIsGuided] = useState(true);
  const [sessionName, setSessionName] = useState('No Pixeo sessions yet.');
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'campaign' | 'pixeo' | 'analytics'>('pixeo');
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('Creator mode');
  const [selectedSubTab, setSelectedSubTab] = useState<'image' | 'video' | 'edit'>('image');
  
  // Chat & AI Generation State
  const [isPixeoPanelOpen, setIsPixeoPanelOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Generated Creatives List
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // Messages matching reference screenshot
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'pixeo' | 'user';
    type?: 'text' | 'badge' | 'step_card';
    text?: string;
    badgeText?: string;
    stepTitle?: string;
    stepDescription?: string;
    actionButton?: string;
  }>>([
    {
      id: '1',
      sender: 'pixeo',
      type: 'text',
      text: 'What are we making? Pick a format, or just describe it.'
    },
    {
      id: '2',
      sender: 'user',
      type: 'badge',
      badgeText: '✓ Creator mode'
    },
    {
      id: '3',
      sender: 'pixeo',
      type: 'text',
      text: 'Using your brand, Workspace3726.\nPaste your script, or a one-line idea and I will write it out. You edit the script before anything is created.',
      actionButton: 'Change format'
    },
    {
      id: '4',
      sender: 'pixeo',
      type: 'step_card',
      stepTitle: 'STEP 1 OF 3 • PICTURES',
      stepDescription: 'Add the product photo if you have one, or skip. Reference photos and a logo are optional.'
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsgId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      {
        id: newMsgId,
        sender: 'user',
        type: 'text',
        text: userText
      }
    ]);
    setChatInput('');

    // Trigger AI Generation in Pixeo Canvas
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(2);

      const newCreative: GeneratedImage = {
        id: Date.now().toString(),
        url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
        title: userText,
        tag: 'AI CREATIVE V3',
        aspectRatio: '1:1',
        format: selectedFormat
      };

      setGeneratedImages(prev => [newCreative, ...prev]);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'pixeo',
          type: 'text',
          text: `✨ I've generated high-converting creatives for "${userText}". You can preview, edit text overlays, or send directly to your Meta campaign!`
        },
        {
          id: (Date.now() + 2).toString(),
          sender: 'pixeo',
          type: 'step_card',
          stepTitle: 'STEP 2 OF 3 • AD COPY & CTA',
          stepDescription: 'Headline: 100% Pure Organic Formulation. Click "Send to Campaign" to deploy instantly to Meta Ads Manager.'
        }
      ]);
    }, 1600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          type: 'badge',
          badgeText: `📷 Uploaded: ${file.name}`
        },
        {
          id: (Date.now() + 1).toString(),
          sender: 'pixeo',
          type: 'text',
          text: `Got your reference product photo! I'm synthesizing creative backgrounds and text placements for high CTR.`
        }
      ]);

      // Add uploaded photo as starter creative
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedImages(prev => [
          {
            id: Date.now().toString(),
            url: imageUrl,
            title: 'Custom Product Creative',
            tag: 'PROCESSED',
            aspectRatio: '1:1',
            format: selectedFormat
          },
          ...prev
        ]);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#07070c] text-white overflow-hidden select-none font-sans">
      
      {/* ================= 1. TOP GLOBAL HEADER BAR ================= */}
      <header className="h-14 px-5 sm:px-6 bg-[#090912] border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white">PIXEO</h1>
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
        
        {/* Left: Creative Generation & Project ID */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3.5 bg-gray-300 rounded-full"></span>
              <span className="w-1 h-3.5 bg-gray-300 rounded-full"></span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-white leading-tight">Creative Generation</span>
            <span className="text-[11px] text-gray-400 font-mono">project-2481</span>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Guided Toggle */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#12121f] border border-white/10 text-xs text-gray-300 font-medium">
            <span>Guided</span>
            <button
              onClick={() => setIsGuided(!isGuided)}
              className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                isGuided ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 ${
                  isGuided ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

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
              <div className="absolute right-0 mt-2 w-56 bg-[#161528] border border-white/10 rounded-xl p-1.5 shadow-2xl z-50">
                <button
                  onClick={() => {
                    setSessionName('Summer Creatives 2026');
                    setIsSessionDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-gray-200"
                >
                  Summer Creatives 2026
                </button>
                <button
                  onClick={() => {
                    setSessionName('Whey Protein Ad Sets');
                    setIsSessionDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 text-gray-200"
                >
                  Whey Protein Ad Sets
                </button>
                <div className="h-px bg-white/5 my-1"></div>
                <button
                  onClick={() => {
                    setSessionName('No Pixeo sessions yet.');
                    setGeneratedImages([]);
                    setIsSessionDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-purple-400 hover:bg-purple-500/10"
                >
                  + Start New Session
                </button>
              </div>
            )}
          </div>

          {/* New Creative Button */}
          <button
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className="px-4 py-1.5 rounded-full bg-[#161528] hover:bg-[#201f38] border border-white/15 text-white text-xs font-medium transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>New creative</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* ================= 3. MAIN WORKSPACE CONTAINER ================= */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 bg-[#07070c]">
        
        {/* ================= LEFT / MAIN CREATIVE STUDIO ================= */}
        <div className="flex-1 flex flex-col bg-[#0a0a12] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Main Creative Canvas Area */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            
            {/* Top Canvas Banner: [ GUIDED ] New creative | Pick a format in the chat */}
            <div className="w-full bg-[#11111e] border border-white/10 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between mb-6 shadow-md">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md border border-white/20 text-[10px] font-bold text-gray-300 font-mono tracking-wider">
                  GUIDED
                </span>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {selectedFormat || 'New creative'}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {selectedFormat === 'New creative' ? 'Pick a format in the chat' : (generatedImages.length > 0 ? `${generatedImages.length} creatives generated` : 'Setting up')}
                  </span>
                </div>
              </div>
            </div>

            {/* Empty State vs Generated Creatives Grid */}
            {generatedImages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center px-4 py-12 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  No images generated yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md flex items-center gap-1.5 flex-wrap">
                  <span>Images generated in this</span>
                  <span className="bg-[#5b3af6] text-white px-1.5 py-0.5 rounded text-xs font-medium">session</span>
                  <span>will appear here.</span>
                </p>

                {/* Quick action buttons to start */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setChatInput("Create high-impact Instagram Story ad creatives for Organic Whey Isolate Protein");
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Whey Protein Ads</span>
                  </button>
                  <button
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Product Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Session Creatives ({generatedImages.length})
                  </h4>
                  <span className="text-xs text-purple-400 font-mono">Auto-Optimized for Meta Ads</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative bg-[#131222] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all shadow-xl flex flex-col"
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-square w-full overflow-hidden bg-black/60">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-purple-300 font-mono">
                          {img.tag}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-gray-300">
                          {img.aspectRatio}
                        </div>
                      </div>

                      {/* Info & Actions */}
                      <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{img.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{img.format}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <button
                            onClick={() => {
                              navigate('/xeno', { state: { initialPrompt: img.title } });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Use in Campaign</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <a
                            href={img.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
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

              {/* Tab 2: Pixeo (Active) */}
              <button
                onClick={() => setActiveBottomTab('pixeo')}
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
                onClick={() => navigate('/neo')}
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

        {/* ================= RIGHT PANEL: PIXEO AI ASSISTANT ================= */}
        {isPixeoPanelOpen && (
          <div className="w-[310px] sm:w-[340px] lg:w-[360px] bg-[#090912] border border-white/10 rounded-2xl sm:rounded-3xl flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
            
            {/* Header: Pixeo title & Collapse button */}
            <div className="h-14 flex items-center justify-between px-4 bg-[#0b0b14] border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Pixeo</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400">
                <button
                  onClick={() => setIsPixeoPanelOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Conversation Canvas (Dot Grid Matrix Background) */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 relative bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]">
              
              {/* 1. Pixeo Question Bubble */}
              <div className="flex flex-col items-start">
                <div className="w-full rounded-2xl p-4 text-xs sm:text-sm leading-relaxed bg-[#131322] text-gray-200 border border-white/10 shadow-sm">
                  What are we making? Pick a format, or just describe it.
                </div>
              </div>

              {/* 2. PICK A FORMAT Interactive Component matching media_1791560494682.png, media_1791560823875.png, media_1791560850096.png */}
              <div className="w-full bg-[#141420] border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3.5">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-gray-300 uppercase font-mono">
                    PICK A FORMAT
                  </span>
                </div>

                {/* Sub-tabs: [ Image ]  [ Video ]  [ Edit ] */}
                <div className="inline-flex items-center p-1 rounded-full bg-black/40 border border-white/10 gap-1">
                  <button
                    onClick={() => setSelectedSubTab('image')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedSubTab === 'image'
                        ? 'border border-white/40 bg-white/10 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    onClick={() => setSelectedSubTab('video')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedSubTab === 'video'
                        ? 'border border-white/40 bg-white/10 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Video
                  </button>
                  <button
                    onClick={() => setSelectedSubTab('edit')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedSubTab === 'edit'
                        ? 'border border-white/40 bg-white/10 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Edit
                  </button>
                </div>

                {/* FORMAT TILES ACCORDING TO ACTIVE SUBTAB */}
                {selectedSubTab === 'image' && (
                  <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                    {/* Option 1: Product photoshoot */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Product photoshoot');
                        setChatInput('Product photoshoot for Organic Whey Isolate');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Product photoshoot'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Product photoshoot</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Your product, relit and restaged</span>
                    </div>

                    {/* Option 2: From a description */}
                    <div
                      onClick={() => {
                        setSelectedFormat('From a description');
                        setChatInput('Generate visual from description: ');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'From a description'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">From a description</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Generated from your brief</span>
                    </div>

                    {/* Option 3: Carousel */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Carousel');
                        setChatInput('Create 3-card carousel ad set for high conversion');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Carousel'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Carousel</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">A sequence of cards, one story</span>
                    </div>

                    {/* Option 4: Creator mode */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Creator mode');
                        setChatInput('Write creator UGC script and create video ad');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Creator mode'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Creator mode</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Write the script, then create it</span>
                    </div>
                  </div>
                )}

                {selectedSubTab === 'video' && (
                  <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                    {/* Option 1: Creator / UGC */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Creator / UGC');
                        setChatInput('Creator UGC script with phone-shot style actor talking to camera');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Creator / UGC'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Creator / UGC</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">A person talks to camera, in a phone-shot style</span>
                    </div>

                    {/* Option 2: Animate a still */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Animate a still');
                        setChatInput('Animate this artwork with dynamic motion lighting');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Animate a still'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Animate a still</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Adds motion to this artwork only</span>
                    </div>

                    {/* Option 3: New angles */}
                    <div
                      onClick={() => {
                        setSelectedFormat('New angles');
                        setChatInput('Generate 360-degree new angles and perspective views of product');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'New angles'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">New angles</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Additional views of the same product</span>
                    </div>

                    {/* Option 4: Feature highlight */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Feature highlight');
                        setChatInput('Highlight 3 key product features with callout labels');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Feature highlight'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Feature highlight</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Demonstrates one feature</span>
                    </div>

                    {/* Option 5: Product showcase */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Product showcase');
                        setChatInput('Cinematic 4K product commercial film');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Product showcase'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Product showcase</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Cinematic product film</span>
                    </div>

                    {/* Option 6: Offer / promo */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Offer / promo');
                        setChatInput('Create urgency 24-hour flash sale offer video ad');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Offer / promo'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Offer / promo</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">A time-limited offer</span>
                    </div>
                  </div>
                )}

                {selectedSubTab === 'edit' && (
                  <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                    {/* Option 1: Edit an image */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Edit an image');
                        setChatInput('Edit uploaded product image: change background and lighting');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Edit an image'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Edit an image</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Change an existing image</span>
                    </div>

                    {/* Option 2: Resize / aspect */}
                    <div
                      onClick={() => {
                        setSelectedFormat('Resize / aspect');
                        setChatInput('Rebuild layout across 1:1 Feed, 9:16 Story, and 16:9 Landscape');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[78px] ${
                        selectedFormat === 'Resize / aspect'
                          ? 'border-white/60 bg-white/10 ring-1 ring-white/30'
                          : 'border-white/10 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white leading-tight">Resize / aspect</span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-1">Rebuild layout for each placement</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Dynamic Chat Messages (if any sent) */}
              {messages.map((msg) => {
                if (msg.type === 'badge') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="px-3.5 py-1.5 rounded-2xl bg-[#1e153a] border border-purple-500/40 text-purple-200 text-xs font-medium shadow-sm">
                        {msg.badgeText}
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'step_card') {
                  return (
                    <div
                      key={msg.id}
                      className="w-full bg-[#131222] border border-white/10 rounded-2xl p-4 text-left shadow-lg space-y-1.5"
                    >
                      <span className="text-[10px] font-bold tracking-widest text-[#818cf8] uppercase font-mono">
                        {msg.stepTitle}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {msg.stepDescription}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#7c3aed] text-white rounded-br-none shadow-md'
                          : 'bg-[#141422] text-gray-200 border border-white/10 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-950/20 border border-purple-500/20 p-3 rounded-2xl">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing creative assets & script...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Container matching media_1791560494682.png */}
            <div className="p-3 bg-[#090912] border-t border-white/5 shrink-0">
              
              {/* Grab Handle */}
              <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-2.5"></div>

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
                    placeholder="Describe what you want to make"
                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none resize-none px-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
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

      {/* ================= FORMAT SELECTOR MODAL ================= */}
      {isFormatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#100f1c] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h3 className="text-base font-bold text-white">Choose Creative Format</h3>
              <button
                onClick={() => setIsFormatModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Creator mode', desc: 'Direct-to-camera or founder UGC script & visuals' },
                { name: 'Product Showcase', desc: 'Studio lighting, 3D isolate, and key benefits overlay' },
                { name: 'Story & Reel (9:16)', desc: 'Vertical video clips with animated captions' },
                { name: 'Square Feed (1:1)', desc: 'Multi-variation image carousel ad cards' }
              ].map((fmt) => (
                <div
                  key={fmt.name}
                  onClick={() => {
                    setSelectedFormat(fmt.name);
                    setIsFormatModalOpen(false);
                    setMessages(prev => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        sender: 'user',
                        type: 'badge',
                        badgeText: `✓ ${fmt.name}`
                      },
                      {
                        id: (Date.now() + 1).toString(),
                        sender: 'pixeo',
                        type: 'text',
                        text: `Format switched to ${fmt.name}. I've aligned the canvas templates accordingly.`
                      }
                    ]);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedFormat === fmt.name
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-black/30 border-white/5 hover:border-white/15 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{fmt.name}</span>
                    {selectedFormat === fmt.name && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{fmt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

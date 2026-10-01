import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Badge } from '../components/ui';
import { Globe, Sparkles, Upload, Image as ImageIcon, Video, Layers, MessageCircle, ShoppingCart, MousePointerClick, Heart, TrendingUp, Info, Check, CheckCircle2, ArrowRight, Wand2, UploadCloud } from 'lucide-react';
import { MetaAdPreview } from '../components/MetaAdPreview';

export function CreativeEngine() {
  const [step, setStep] = useState(1);
  
  // Step 1: Website
  const [url, setUrl] = useState('');
  
  // Step 2: Creative
  const [creativeType, setCreativeType] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  // Step 3: Goal
  const [goal, setGoal] = useState<string | null>(null);
  const [messageDestinations, setMessageDestinations] = useState({
    whatsapp: true,
    instagram: false,
    messenger: false
  });

  // Step 4: Budget
  const [budget, setBudget] = useState<string | null>(null);
  const [customBudget, setCustomBudget] = useState('');
  
  // Final Review State
  const [isBuilding, setIsBuilding] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const creativeOptions = [
    { id: 'ai_all', title: 'AI will create everything', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'upload_image', title: 'Upload my Image', icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'upload_video', title: 'Upload my Video', icon: Video, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'upload_carousel', title: 'Upload Carousel', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'use_website', title: 'Use images/videos from my website', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const goalOptions = [
    { id: 'leads', title: 'Generate Leads', icon: TrendingUp },
    { id: 'messages', title: 'Get WhatsApp/Messages', icon: MessageCircle },
    { id: 'sales', title: 'Get Website Sales', icon: ShoppingCart },
    { id: 'traffic', title: 'Get Website Traffic', icon: MousePointerClick },
    { id: 'engagement', title: 'Get Engagement', icon: Heart },
    { id: 'awareness', title: 'Build Brand Awareness', icon: Globe },
  ];

  const budgetOptions = ['₹100', '₹200', '₹500', '₹1,000', '₹2,000'];

  const handleReview = () => {
    setIsBuilding(true);
    setStep(5);
    setTimeout(() => {
      setIsBuilding(false);
      setShowPreview(true);
    }, 2500);
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Ads Autopilot</h1>
        <p className="text-slate-500 mt-1 font-medium text-lg">Let AI build, test, and optimize your entire campaign.</p>
      </div>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`relative z-10 flex flex-col items-center justify-center transition-colors ${step >= num ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 border-2 ${step >= num ? 'bg-white border-blue-600' : 'bg-slate-50 border-slate-300'}`}>
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-background px-2">
                {num === 1 ? 'Website' : num === 2 ? 'Creative' : num === 3 ? 'Goal' : 'Budget'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Website */}
      {step === 1 && (
        <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Step 1: Website</h2>
            <p className="text-slate-500 font-medium">Where do you want to send people?</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://mybusiness.com" 
                className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={nextStep} disabled={!url} className="px-8 py-3 text-lg font-bold">
                Analyze Website <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Creative */}
      {step === 2 && (
        <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Step 2: Creative</h2>
            <p className="text-slate-500 font-medium">How do you want to create your ad?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creativeOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => setCreativeType(opt.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer flex items-center transition-all ${
                    creativeType === opt.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className={`w-10 h-10 ${opt.bg} rounded-lg flex items-center justify-center mr-4 shrink-0`}>
                    <opt.icon className={`w-5 h-5 ${opt.color}`} />
                  </div>
                  <span className="font-bold text-slate-800">{opt.title}</span>
                  {creativeType === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />}
                </div>
              ))}
            </div>

            {/* File Upload Area */}
            {(creativeType === 'upload_image' || creativeType === 'upload_video' || creativeType === 'upload_carousel') && (
              <div className="mt-6 p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                {!uploadedFile ? (
                  <>
                    <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">
                      Upload your {creativeType === 'upload_image' ? 'Image' : creativeType === 'upload_video' ? 'Video' : 'Carousel Images'}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">Drag and drop files here, or click to browse.</p>
                    <Button 
                      variant="secondary" 
                      onClick={() => setUploadedFile('mock_file.jpg')}
                      className="font-bold"
                    >
                      Browse Files
                    </Button>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">File Uploaded Successfully!</h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">Your media is ready for the campaign.</p>
                    <Button 
                      variant="ghost" 
                      onClick={() => setUploadedFile(null)}
                      className="font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove File
                    </Button>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={prevStep} className="font-bold">Back</Button>
              <Button 
                onClick={nextStep} 
                disabled={!creativeType || ((creativeType.includes('upload')) && !uploadedFile)} 
                className="px-8 py-2 font-bold"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Goal */}
      {step === 3 && (
        <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Step 3: Goal</h2>
            <p className="text-slate-500 font-medium">What do you want to achieve?</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer flex items-center transition-all ${
                    goal === opt.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <opt.icon className={`w-6 h-6 mr-3 ${goal === opt.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-800">{opt.title}</span>
                  {goal === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />}
                </div>
              ))}
            </div>

            {goal === 'messages' && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <h4 className="font-bold text-slate-900 mb-3 text-sm">Select messaging destinations:</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={messageDestinations.whatsapp} onChange={(e) => setMessageDestinations({...messageDestinations, whatsapp: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="font-medium text-slate-700">WhatsApp</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={messageDestinations.instagram} onChange={(e) => setMessageDestinations({...messageDestinations, instagram: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="font-medium text-slate-700">Instagram</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={messageDestinations.messenger} onChange={(e) => setMessageDestinations({...messageDestinations, messenger: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="font-medium text-slate-700">Messenger</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={prevStep} className="font-bold">Back</Button>
              <Button onClick={nextStep} disabled={!goal} className="px-8 py-2 font-bold">Next Step</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Budget */}
      {step === 4 && (
        <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Step 4: Budget</h2>
            <p className="text-slate-500 font-medium">What is your daily Meta advertising budget?</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex flex-wrap gap-3">
              {budgetOptions.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => { setBudget(opt); setCustomBudget(''); }}
                  className={`px-6 py-3 border-2 rounded-xl cursor-pointer font-bold text-lg transition-all ${
                    budget === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:border-blue-200'
                  }`}
                >
                  {opt}
                </div>
              ))}
              <div 
                className={`px-4 py-3 border-2 rounded-xl cursor-text font-bold text-lg flex items-center transition-all ${
                  budget === 'custom' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:border-blue-200'
                }`}
                onClick={() => setBudget('custom')}
              >
                Custom: ₹ 
                <input 
                  type="number" 
                  value={customBudget}
                  onChange={(e) => {
                    setBudget('custom');
                    setCustomBudget(e.target.value);
                  }}
                  className="w-24 bg-transparent outline-none ml-1 text-slate-900 placeholder:text-slate-300"
                  placeholder="3000"
                />
              </div>
            </div>

            <div className="flex items-start bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 mt-4">
              <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-blue-600" />
              <p className="text-sm font-medium">
                This budget is your Meta advertising budget. This money goes directly to Meta, not to AdPilot AI. The campaign will run from your connected Meta Ad Account.
              </p>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={prevStep} className="font-bold">Back</Button>
              <Button onClick={handleReview} disabled={!budget || (budget === 'custom' && !customBudget)} className="px-8 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
                <Wand2 className="w-5 h-5 mr-2" /> Let AI Build Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Processing & Review */}
      {step === 5 && (
        <div className="space-y-6">
          {isBuilding ? (
            <Card className="border-primary-200 shadow-md">
              <CardContent className="p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-blue-100 rounded-full border-t-blue-600 animate-spin"></div>
                  <Wand2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">AI is building your campaign...</h2>
                <div className="h-6 overflow-hidden mt-4">
                  <div className="flex flex-col text-slate-500 font-medium animate-[slideUp_8s_ease-in-out_infinite]">
                    <span className="h-6 flex items-center justify-center">Analyzing {url || 'website'}...</span>
                    <span className="h-6 flex items-center justify-center">Generating Audience Strategy...</span>
                    <span className="h-6 flex items-center justify-center">Writing Persuasive Ad Copy...</span>
                    <span className="h-6 flex items-center justify-center">Configuring Meta Campaign Structure...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : showPreview ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center">
                    <Sparkles className="w-6 h-6 text-blue-600 mr-2" /> AI Strategy Ready
                  </h2>
                  <p className="text-slate-500 font-medium">Review your automated campaign settings below before launching.</p>
                </div>

                <Card>
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Campaign Architecture</h3>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-slate-100 text-sm">
                    <div className="p-4 flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Objective</span>
                      <span className="font-bold text-slate-900">{goal === 'leads' ? 'Lead Generation' : goal === 'sales' ? 'Sales / Conversions' : goal === 'messages' ? 'Messages' : 'Traffic'}</span>
                    </div>
                    <div className="p-4 flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Budget</span>
                      <span className="font-bold text-slate-900">{budget === 'custom' ? `₹${customBudget}` : budget} / day</span>
                    </div>
                    <div className="p-4 flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Audience Strategy</span>
                      <span className="font-bold text-blue-600">AI Broad Match + Retargeting</span>
                    </div>
                    <div className="p-4 flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase tracking-wider text-xs">Placements</span>
                      <span className="font-bold text-slate-900">Advantage+ Placements</span>
                    </div>
                  </CardContent>
                </Card>

                {!isPublished ? (
                  <Button 
                    onClick={handlePublish}
                    className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Approve & Publish to Meta
                  </Button>
                ) : (
                  <Card className="border-green-200 bg-green-50 shadow-sm animate-in zoom-in-95 duration-300">
                    <CardContent className="p-6 flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 shrink-0 shadow-md">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-900">Successfully Published!</h3>
                        <p className="text-green-700 font-medium text-sm">The AI Learning Loop is now active and monitoring lead quality.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs mb-4">Meta Ad Preview</h3>
                <MetaAdPreview 
                  pageName="My Business Page"
                  adCopy="We analyzed the top strategies used by the fastest-growing businesses in your industry. Now it's your turn. Contact us today for a free consultation and let's scale your revenue."
                  headline="Get Your Free Consultation Today"
                  description="Top-rated services • Over 1,000 happy clients"
                  cta={goal === 'messages' ? 'Send Message' : 'Learn More'}
                  format={creativeType === 'upload_video' ? 'video' : creativeType === 'upload_carousel' ? 'carousel' : 'image'}
                  imageUrl={creativeType?.includes('video') || creativeType?.includes('carousel') ? undefined : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                />
              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* Global CSS for animations */}
      <style>{`
        @keyframes slideUp {
          0%, 20% { transform: translateY(0); }
          25%, 45% { transform: translateY(-24px); }
          50%, 70% { transform: translateY(-48px); }
          75%, 95% { transform: translateY(-72px); }
          100% { transform: translateY(-96px); }
        }
      `}</style>
    </div>
  );
}

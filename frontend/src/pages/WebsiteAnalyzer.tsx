import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Badge } from '../components/ui';
import { Globe, Search, ArrowRight, CheckCircle2, Image as ImageIcon, Video, Box, Tag, Zap, Target, MousePointerClick, BarChart3 } from 'lucide-react';

export function WebsiteAnalyzer() {
  const [url, setUrl] = useState('');
  const [adFormat, setAdFormat] = useState('image');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);

  const loadingSteps = [
    'Scanning Business Type...',
    'Extracting Products & Prices...',
    'Finding Offers & USPs...',
    'Downloading Brand Images...',
    'Identifying CTAs & Forms...',
    'Checking Tracking Pixels...'
  ];

  const handleAnalyze = () => {
    if (!url) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate staggered loading steps
    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingSteps.length - 1) {
        step++;
        setCurrentLoadingStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisComplete(true);
        }, 800);
      }
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Website Analyzer (Phase 2)</h1>
        <p className="text-slate-500 mt-1 font-medium text-lg">Our AI will scan your website to automatically generate the perfect ad strategy.</p>
      </div>

      <Card className="border-primary-200 shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 font-medium rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg"
                />
              </div>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preferred Ad Format</label>
              <select 
                value={adFormat}
                onChange={(e) => setAdFormat(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-lg"
              >
                <option value="image">Image Ads</option>
                <option value="video">Video Ads</option>
                <option value="carousel">Carousel Ads</option>
              </select>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={!url || isAnalyzing}
              className="w-full md:w-auto py-3 px-8 text-lg rounded-xl shadow-sm shadow-primary-500/20"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Search className="w-6 h-6 text-primary-500 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900">AI is analyzing your website...</h3>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                {loadingSteps.map((step, idx) => (
                  <div key={idx} className={`flex items-center transition-all duration-500 ${idx <= currentLoadingStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {idx < currentLoadingStep ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                    ) : idx === currentLoadingStep ? (
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-200 rounded-full mr-3 shrink-0" />
                    )}
                    <span className={`font-semibold ${idx === currentLoadingStep ? 'text-primary-700' : idx < currentLoadingStep ? 'text-slate-700' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4 text-primary-600">
                <Box className="w-6 h-6 mr-2" />
                <h3 className="font-bold text-lg text-slate-900">Business & Products</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Type</p>
                  <p className="font-semibold text-slate-900">E-Commerce (Fitness Supplements)</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Products</p>
                  <ul className="list-disc list-inside font-medium text-slate-700 mt-1 space-y-1">
                    <li>100% Whey Protein (₹2,499)</li>
                    <li>Pre-Workout Blast (₹1,299)</li>
                    <li>Vegan Protein Blend (₹2,199)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4 text-primary-600">
                <Zap className="w-6 h-6 mr-2" />
                <h3 className="font-bold text-lg text-slate-900">Offers & USPs</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Offers</p>
                  <p className="font-semibold text-green-600">Buy 1 Get 1 50% Off (Code: BOGO50)</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unique Selling Points</p>
                  <ul className="list-disc list-inside font-medium text-slate-700 mt-1 space-y-1">
                    <li>Zero Added Sugar</li>
                    <li>Lab Tested & Certified</li>
                    <li>Free Shipping over ₹999</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4 text-primary-600">
                <Target className="w-6 h-6 mr-2" />
                <h3 className="font-bold text-lg text-slate-900">Funnel & Tracking</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Action</p>
                  <p className="font-semibold text-slate-900">E-commerce Checkout</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call to Action (CTA)</p>
                  <p className="font-semibold text-blue-600">"Shop Now", "Add to Cart"</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Availability</p>
                  <Badge variant="success" className="mt-1">Meta Pixel Detected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <span className="w-5 h-5 text-yellow-400 mr-2" />
                  AI Campaign Strategy Ready
                </h3>
                <p className="text-slate-300 font-medium">Based on the analysis, we've prepared high-converting {adFormat === 'image' ? 'Image' : adFormat === 'video' ? 'Video' : 'Carousel'} Ad creatives and copy specifically tailored for your audience.</p>
              </div>
              <Button className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 text-lg rounded-xl">
                Generate Ads Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

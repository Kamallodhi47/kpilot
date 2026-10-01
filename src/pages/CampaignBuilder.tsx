import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Building, Image as ImageIcon, ChevronRight, Share2 } from 'lucide-react';

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const campaignType = queryParams.get('type') || 'standard';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasWebsite, setHasWebsite] = useState(campaignType !== 'post');
  const [campaignGoal, setCampaignGoal] = useState(campaignType === 'post' ? 'Engagement' : 'Leads');
  const [budget, setBudget] = useState(campaignType === 'post' ? 5 : 10);
  const [formData, setFormData] = useState({
    websiteUrl: '',
    postUrl: '',
    campaignName: '',
    targetLocation: '',
    targetAge: '18 - 65+',
    targetAudience: '',
    engagementType: 'Post Engagement (Likes, Comments, Shares)',
    callToAction: 'Send Message (WhatsApp / Messenger)',
    placements: ['Facebook Feed', 'Instagram Feed', 'Stories & Reels']
  });

  const updateForm = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (campaignType === 'post') {
      setHasWebsite(false);
      setCampaignGoal('Engagement');
      setBudget(5);
    }
  }, [campaignType]);

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGoal = e.target.value;
    setCampaignGoal(newGoal);
    
    // Set realistic minimum default budgets based on Meta Ads guidelines
    switch(newGoal) {
      case 'Awareness':
        setBudget(1);
        break;
      case 'Traffic':
      case 'Engagement':
        setBudget(5);
        break;
      case 'Leads':
      case 'App Promotion':
      case 'Sales':
        setBudget(10);
        break;
      default:
        setBudget(10);
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      
      const payload = {
        type: campaignType,
        name: formData.campaignName,
        goal: campaignGoal,
        budget: budget,
        target_location: formData.targetLocation,
        target_age: formData.targetAge,
        target_audience: formData.targetAudience,
        website_url: formData.websiteUrl,
        post_url: formData.postUrl,
        engagement_type: formData.engagementType,
        call_to_action: formData.callToAction,
        placements: formData.placements
      };

      try {
        const response = await fetch('http://localhost:5000/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error('Failed to save campaign');
        }
        
        setTimeout(() => {
          navigate('/processing');
        }, 800);
      } catch (error) {
        console.error(error);
        alert('Failed to save campaign to backend.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Build Campaign</h1>
        <p className="text-muted-foreground">Follow the steps below to configure your AI-generated Meta marketing campaign.</p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-black/10">
          <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-foreground justify-center bg-primary transition-all duration-500 ease-in-out"></div>
        </div>
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span className={step >= 1 ? 'text-primary' : ''}>Website Analysis</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Business Info</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Media Assets</span>
        </div>
      </div>

      <div className="glass-card rounded-xl p-8 relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                {hasWebsite ? <Globe className="w-8 h-8 text-primary" /> : <Share2 className="w-8 h-8 text-primary" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {hasWebsite ? 'Website Analysis' : 'Post / Page Details'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasWebsite ? 'Our AI will crawl your site to understand your brand.' : 'Provide a post or page link to generate leads directly on Meta.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setHasWebsite(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${hasWebsite ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-black/5 text-muted-foreground hover:bg-black/10'}`}
              >
                I have a Website
              </button>
              <button
                onClick={() => setHasWebsite(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!hasWebsite ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-black/5 text-muted-foreground hover:bg-black/10'}`}
              >
                No Website (Post/Leads)
              </button>
            </div>

            {hasWebsite ? (
              <div className="space-y-2">
                <label htmlFor="url" className="block text-sm font-medium text-muted-foreground">Target Website URL</label>
                <input
                  type="url"
                  name="url"
                  id="url"
                  className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="https://your-business.com"
                  value={formData.websiteUrl} onChange={(e) => updateForm('websiteUrl', e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="post-url" className="block text-sm font-medium text-muted-foreground">Facebook/Instagram Post URL (Optional)</label>
                <input
                  type="url"
                  name="post-url"
                  id="post-url"
                  className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="https://facebook.com/your-page/posts/123" value={formData.postUrl} onChange={(e) => updateForm('postUrl', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">If left blank, our AI will generate a fresh creative for a Meta Lead Generation Form.</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center space-x-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Campaign Details</h3>
                <p className="text-sm text-muted-foreground">Provide basic information about your campaign parameters.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Campaign Name</label>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="e.g. Summer Sale 2026 - Conversion" value={formData.campaignName} onChange={(e) => updateForm('campaignName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Campaign Goal</label>
                <select 
                  value={campaignGoal}
                  onChange={handleGoalChange}
                  className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none"
                >
                  <option>Awareness</option>
                  <option>Traffic</option>
                  <option>Engagement</option>
                  <option>Leads</option>
                  <option>App Promotion</option>
                  <option>Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Campaign Budget</label>
                <div className="flex space-x-2">
                  <select className="block w-1/2 rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                    <option>Daily budget</option>
                    <option>Lifetime budget</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-muted-foreground sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      min={
                        campaignGoal === 'Awareness' ? 1 :
                        ['Traffic', 'Engagement'].includes(campaignGoal) ? 5 : 10
                      }
                      className="block w-full rounded-md border-0 py-3 pl-7 pr-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Location</label>
                <input
                  type="text"
                  placeholder="e.g. United States, New York" value={formData.targetLocation} onChange={(e) => updateForm('targetLocation', e.target.value)}
                  className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Age Range</label>
                <select value={formData.targetAge} onChange={(e) => updateForm('targetAge', e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                  <option>18 - 65+</option>
                  <option>18 - 24</option>
                  <option>25 - 34</option>
                  <option>35 - 44</option>
                  <option>45 - 54</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Audience Description</label>
                <textarea
                  rows={3}
                  className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="e.g. Small business owners looking for marketing automation..." value={formData.targetAudience} onChange={(e) => updateForm('targetAudience', e.target.value)}
                />
              </div>
            </div>

            {campaignType === 'post' && (
              <div className="mt-8 border-t border-black/10 pt-6">
                <h4 className="text-lg font-medium text-foreground mb-4">Post Campaign Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Engagement Type</label>
                    <select value={formData.engagementType} onChange={(e) => updateForm('engagementType', e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                      <option>Post Engagement (Likes, Comments, Shares)</option>
                      <option>Page Likes</option>
                      <option>Event Responses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Call to Action (CTA)</label>
                    <select value={formData.callToAction} onChange={(e) => updateForm('callToAction', e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                      <option>Send Message (WhatsApp / Messenger)</option>
                      <option>Learn More</option>
                      <option>Shop Now</option>
                      <option>No Button</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Ad Placements</label>
                    <div className="flex items-center space-x-6 bg-white/20 p-4 rounded-md border border-black/5">
                      <label className="flex items-center space-x-2 text-sm text-foreground">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                        <span>Facebook Feed</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-foreground">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                        <span>Instagram Feed</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-foreground">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                        <span>Stories & Reels</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center space-x-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                {campaignType === 'post' ? <Share2 className="w-8 h-8 text-primary" /> : <ImageIcon className="w-8 h-8 text-primary" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {campaignType === 'post' ? 'Post Creative' : 'Media Assets'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {campaignType === 'post' ? 'Your post will be used directly as the ad creative.' : 'Upload photos or videos for the AI to use in creatives.'}
                </p>
              </div>
            </div>
            
            {campaignType === 'post' ? (
              <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-solid border-primary/20 bg-primary/5 px-6 py-14">
                <Share2 className="mx-auto h-12 w-12 text-primary/60 mb-4" />
                <p className="text-sm font-medium text-foreground text-center">Post Link Confirmed</p>
                <p className="text-xs text-muted-foreground text-center mt-1">No additional media needed. We will boost the post directly.</p>
              </div>
            ) : (
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-black/20 px-6 py-14 hover:bg-black/5 transition-colors cursor-pointer">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                    <span className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, MP4 up to 50MB</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end pt-6 border-t border-black/10">
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-md transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] disabled:opacity-50"
          >
            {loading ? 'Processing...' : step === 3 ? 'Generate Campaign' : 'Next Step'}
            {!loading && <ChevronRight className="ml-2 w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

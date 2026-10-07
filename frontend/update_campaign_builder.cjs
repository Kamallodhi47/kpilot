const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'CampaignBuilder.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add formData state
content = content.replace(
  `  const [budget, setBudget] = useState(campaignType === 'post' ? 5 : 10);`,
  `  const [budget, setBudget] = useState(campaignType === 'post' ? 5 : 10);
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
  };`
);

// 2. Update handleNext to post data to backend
content = content.replace(
  `  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        navigate('/processing');
      }, 800);
    }
  };`,
  `  const handleNext = async () => {
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
  };`
);

// 3. Bind inputs to formData
content = content.replace(
  `defaultValue="https://"`,
  `value={formData.websiteUrl} onChange={(e) => updateForm('websiteUrl', e.target.value)}`
);

content = content.replace(
  `placeholder="https://facebook.com/your-page/posts/123"`,
  `placeholder="https://facebook.com/your-page/posts/123" value={formData.postUrl} onChange={(e) => updateForm('postUrl', e.target.value)}`
);

content = content.replace(
  `placeholder="e.g. Summer Sale 2026 - Conversion"`,
  `placeholder="e.g. Summer Sale 2026 - Conversion" value={formData.campaignName} onChange={(e) => updateForm('campaignName', e.target.value)}`
);

content = content.replace(
  `placeholder="e.g. United States, New York"`,
  `placeholder="e.g. United States, New York" value={formData.targetLocation} onChange={(e) => updateForm('targetLocation', e.target.value)}`
);

content = content.replace(
  `<select className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                  <option>18 - 65+</option>`,
  `<select value={formData.targetAge} onChange={(e) => updateForm('targetAge', e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                  <option>18 - 65+</option>`
);

content = content.replace(
  `placeholder="e.g. Small business owners looking for marketing automation..."`,
  `placeholder="e.g. Small business owners looking for marketing automation..." value={formData.targetAudience} onChange={(e) => updateForm('targetAudience', e.target.value)}`
);

content = content.replace(
  `<select className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                      <option>Post Engagement (Likes, Comments, Shares)</option>`,
  `<select value={formData.engagementType} onChange={(e) => updateForm('engagementType', e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                      <option>Post Engagement (Likes, Comments, Shares)</option>`
);

content = content.replace(
  `<select className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                      <option>Send Message (WhatsApp / Messenger)</option>`,
  `<select value={formData.callToAction} onChange={(e) => updateForm('callToAction', e.target.value)} className="block w-full rounded-md border-0 py-3 px-4 bg-white/40 text-foreground shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none">
                      <option>Send Message (WhatsApp / Messenger)</option>`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('CampaignBuilder updated.');

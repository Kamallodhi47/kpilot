import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowLeft, 
  Shield, 
  Sun, 
  Moon, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Target, 
  BarChart3, 
  Lock, 
  CheckCircle2, 
  Cpu, 
  Zap,
  Users
} from 'lucide-react';

export default function DataSecurity() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#06030c] text-white' : 'bg-[#f8f9fa] text-slate-900'} transition-colors duration-300 font-sans`}>
      {/* Top Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${theme === 'dark' ? 'bg-[#06030c]/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${theme === 'dark' ? 'border-white/15 bg-white/5 hover:border-indigo-400 hover:bg-indigo-500/10' : 'border-slate-300 bg-slate-100 hover:border-indigo-500'}`}>
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-500 flex items-center justify-center relative shadow-lg shadow-purple-500/30">
                <span className="font-extrabold text-white text-lg leading-none">K</span>
              </div>
              <span className={`font-extrabold text-lg tracking-wider uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                PILOT
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${theme === 'dark' ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/login"
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${theme === 'dark' ? 'border-white/15 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'}`}
            >
              Login
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all"
            >
              Start Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-14 px-6 text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-orange-500/15 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6 tracking-wide">
            <Shield className="w-3.5 h-3.5" />
            <span>ENTERPRISE-GRADE META MARKETING & SECURITY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Our priority, your{' '}
            <span 
              className="italic font-serif bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 bg-clip-text text-transparent inline-block pr-1"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              protection.
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
            Autonomous AI agents for high-converting Meta Marketing (Facebook & Instagram Ads), built on zero-trust data security and end-to-end encryption.
          </p>

          {/* Meta Tag Pill & Date */}
          <div className="inline-flex items-center gap-3 text-xs tracking-wider uppercase font-mono">
            <span className={`px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-white/20 bg-white/5 text-gray-300' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>
              DATA SECURITY & BUSINESS DISCLOSURE
            </span>
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}>·</span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
              LAST UPDATED: MAY 30, 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 pb-28">
        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 01: Introduction & About KPILOT */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">01</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Introduction & About KPILOT</h2>
          </div>

          <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>KPILOT (kpilot.in)</strong> recognises the critical role data security plays in maintaining user trust, client partnerships, and advertising integrity. This Data Security & Business Policy outlines our comprehensive approach to protecting the data entrusted to us by our users, advertiser brands, and enterprise partners. We are committed to exceeding industry standards and adhering to all applicable Indian laws and regulations, including the Information Technology Act, 2000 (IT Act), the Digital Personal Data Protection Act (DPDP Act), and Meta Platform Developer Policies.
          </p>

          <div className={`p-6 rounded-2xl border mb-8 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-indigo-50/50 border-indigo-100'}`}>
            <h4 className="text-base font-semibold text-indigo-400 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Hamara Business (What KPILOT Does)
            </h4>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              KPILOT ek Next-Generation <strong>Autonomous AI Marketing & Ad Management Platform</strong> hai jo brands, agency owners aur performance marketers ke liye <strong>Meta Ads (Facebook & Instagram)</strong> ko complete automate karta hai — campaign creation, high-converting creative generation, real-time ROI tracking aur instant lead capture tak.
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Scope</h3>
          <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            This policy applies to all data collected, processed, and stored by KPILOT across our platforms, agents, and cloud services. This includes:
          </p>

          <ul className="space-y-3 mb-10 pl-1">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>User & Advertiser Data: </strong>
                Information collected during registration and platform usage, such as business name, email address, phone number, connected Meta Ad Account IDs, and role permissions.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Creative & Ad Content Data: </strong>
                Ad copies, banners, video assets, brand logos, and marketing copy generated by KPILOT AI or uploaded by users. Ownership remains 100% with the user; KPILOT only uses temporary access for processing and publishing to Meta.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Meta Campaign & Lead Data: </strong>
                Campaign metrics (ROAS, impressions, CTR, CPC, ad spend) and instant lead form entries collected via official Meta Webhooks and APIs.
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">Disclosure around data retention and deletion for connected user data</h3>
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We store your personal and advertising data only for a duration strictly consistent with our platform operations and business purposes.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">02</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                When an account is closed or the data retention period expires, all associated data is permanently destroyed and purged from production databases.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">03</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Users can request full data erasure at any time by writing an email to{' '}
                <a href="mailto:support@kpilot.in" className="text-indigo-400 underline hover:text-indigo-300 font-medium">
                  support@kpilot.in
                </a>
                , and our security compliance team will execute data deletion within 72 hours.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">04</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Selected transactional audit logs are retained for compliance with legal mandates and financial auditing purposes (such as fraud prevention and tax compliance).
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Disclosure around third-party data sharing</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                KPILOT does not sell, rent, or transfer your ad performance or customer lead data to any third-party brokers. Data is only communicated with Meta Platforms APIs strictly upon your authorized command.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 02: Meta Marketing Process - How We Do Meta Marketing */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">02</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How KPILOT Executes Meta Marketing (Hum Kaise Marketing Karte Hain)</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            KPILOT Meta (Facebook & Instagram) advertising ko scientific aur autonomous banata hai. Humare 4 specialized AI agents poore marketing lifecycle ko step-by-step handle karte hain:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0b0718] border-white/10 hover:border-indigo-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-500/20">
                01
              </div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                Secure Meta OAuth Integration
              </h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Aapka Meta Business Suite, Facebook Page aur Instagram Business Account official Meta Graph API OAuth ke sath securely connect hota hai. Access tokens encrypted vault me store hote hain.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0b0718] border-white/10 hover:border-purple-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-purple-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm mb-4 border border-purple-500/20">
                02
              </div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                AI Audience & Persona Targeting
              </h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                KPILOT AI aapke business niche aur products ko analyze karke high-intent target audiences, Advantage+ cohorts, Lookalikes (1%-5%), aur custom retargeting groups prepare karta hai.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0b0718] border-white/10 hover:border-pink-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-pink-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-sm mb-4 border border-pink-500/20">
                03
              </div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Pixeo: AI Creative & Copy Engine
              </h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Instagram Reels (9:16), Feed Posts (1:1), aur Carousels ke liye eye-catching visuals aur proven psychological hooks ke sath ad copies create karta hai jisse CTR maximize hota hai.
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0b0718] border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-amber-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-4 border border-amber-500/20">
                04
              </div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Xeno & Campulse: Autonomous Campaign Launch
              </h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Single click me Meta Ad Manager me structured campaigns launch hoti hain (Advantage+ Budget Optimization - CBO). Budget dynamically perform karne wale ad sets par shift hota hai.
              </p>
            </div>

            {/* Step 5 */}
            <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0b0718] border-white/10 hover:border-emerald-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-500/20">
                05
              </div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Neo: Real-time ROAS & Analytics
              </h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Return On Ad Spend (ROAS), Cost Per Lead (CPL), aur ad fatigue ko 24/7 monitor karta hai. Bekar ads ko auto-pause aur top ads ko scale karne ke actionable recommendations deta hai.
              </p>
            </div>

            {/* Step 6 */}
            <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0b0718] border-white/10 hover:border-cyan-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-cyan-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4 border border-cyan-500/20">
                06
              </div>
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Instant Lead Sync & Direct DM Automation
              </h4>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Facebook Lead Forms aur Instagram Direct Messages se aane wale customers ke leads real-time sync hote hain aur aapke CRM ya dashboard me instant available ho jate hain.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 03: Meta Platform API & Workspace Compliance */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">03</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meta Platform & Workspace API Governance</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            Our platform integrates with Meta Graph API and external workspace services to provide enhanced automation and advertising intelligence. We affirm the following strict guidelines:
          </p>

          <h3 className="text-lg font-semibold mb-3">Data Usage & AI Training Guardrails</h3>
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We do not use proprietary customer data or connected Meta account data for the development or training of generalised public artificial intelligence (AI) or machine learning (ML) models.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Purpose of Data Access</h3>
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Data accessed through Meta Marketing APIs is strictly utilised for providing services directly related to campaign execution, creative generation, performance analytics, and lead synchronization within the explicit scope authorized by you.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Meta Advertising & Policy Compliance</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We strictly adhere to all guidelines outlined by Meta Advertising Standards, Meta Platform Terms, Commercial Terms, and Meta User Data Policies to ensure advertiser accounts remain fully compliant and protected from policy strikes.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 04: Data Security Measures */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">04</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Security & Infrastructure Protection</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            KPILOT implements a multi-layered security program to safeguard data throughout its lifecycle, from collection to storage and disposal. These measures include:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Access Controls</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Strong authentication mechanisms like multi-factor authentication (MFA) with one-time passwords (OTP) for added security control user access to KPILOT platforms. Access privileges are granted on a least-privilege basis, ensuring users only access data necessary for their specific roles. User activity is logged and monitored for suspicious behaviour.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Encryption</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Data is encrypted at rest using industry-standard algorithms like AES-256, rendering it unreadable even if breached. Data is also encrypted in transit using protocols like HTTPS / TLS 1.3 to ensure secure transfer between user devices, KPILOT servers, and Meta API endpoints.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Network Security</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We employ robust firewalls, intrusion detection/prevention systems (IDS/IPS), and other advanced security measures to protect our network infrastructure from unauthorised access and malicious activity. Regular vulnerability scans are conducted to identify and address potential security weaknesses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Minimisation</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We collect and store only the data necessary for our services to function effectively. We regularly review data retention policies to ensure data is not stored for longer than required.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Segregation</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                User data, content data, and brand data are segregated and stored in separate environments to minimise risk in case of a breach.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Regular Security Reviews</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We conduct regular penetration testing and security assessments to identify and address potential vulnerabilities in our systems and processes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Employee Training</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                All KPILOT employees undergo comprehensive training on data security best practices and procedures, including data handling, user privacy, and incident response protocols.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 05: Security of AI Models and Tech Stack */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">05</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Security of AI Models and Tech Stack</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            KPILOT understands the unique security considerations of AI models and the tech stack that powers them. We implement the following measures to ensure the security and responsible development of our AI:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Model Monitoring</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We continuously monitor our AI models for potential biases that could lead to discriminatory outputs. Additionally, we monitor for security vulnerabilities that could be exploited to manipulate the model's behaviour.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Sanitisation</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Training data for AI models is carefully sanitised to remove any personally identifiable information (PII) or sensitive data that could be leaked through the model's outputs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Secure Coding Practices</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                KPILOT software developers adhere to secure coding practices to minimise vulnerabilities in our codebase. This includes following secure coding guidelines and using static code analysis tools.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Third-Party Security Reviews</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We conduct thorough security reviews of third-party libraries and frameworks used in our tech stack to ensure they meet our security standards.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 06: Data Breach Notification */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">06</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Breach Notification</h2>
          </div>

          <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            In the event of a data breach, KPILOT will take immediate action to contain the breach, investigate the incident, and determine the scope of the issue. We will notify affected individuals and regulatory authorities as required by law. The notification will include details of the breach, the data involved, and steps taken to mitigate the risk.
          </p>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 07: Compliance with Indian Laws and Regulations */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">07</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Compliance with Indian Laws and Regulations</h2>
          </div>

          <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            KPILOT is committed to complying with all applicable Indian laws and regulations regarding data protection and privacy. This includes, but is not limited to:
          </p>

          <ul className="space-y-3 mb-12 pl-1">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                The Information Technology Act, 2000 (IT Act) and its amendments, particularly those related to data security, reasonable security practices, and sensitive personal data protection.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, which outline specific security practices organisations must follow to protect sensitive personal data.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                The Digital Personal Data Protection Act, 2023 (DPDP Act), mandating user consent, purpose limitation, and data fiduciary transparency.
              </div>
            </li>
          </ul>
        </section>

        {/* Bottom Help Notice */}
        <div className={`border-t pt-8 text-center text-sm ${theme === 'dark' ? 'border-white/10 text-gray-400' : 'border-slate-200 text-slate-600'}`}>
          Questions about our Meta marketing capabilities or how we protect your data? Reach out at{' '}
          <a href="mailto:support@kpilot.in" className="text-indigo-400 underline hover:text-indigo-300 font-medium">
            support@kpilot.in
          </a>
          .
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 ${theme === 'dark' ? 'border-white/10 bg-[#040208]' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>© 2026 All Rights Reserved, KPILOT®</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of use</Link>
            <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link to="/data-security" className="text-indigo-400 font-semibold transition-colors">Data Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

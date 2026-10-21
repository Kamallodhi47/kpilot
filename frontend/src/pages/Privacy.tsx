import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Shield, Sun, Moon, Lock, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
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
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative pt-20 pb-14 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6 tracking-wide font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>OFFICIAL PRIVACY POLICY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Privacy{' '}
            <span 
              className="italic font-serif bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 bg-clip-text text-transparent inline-block pr-1"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              Policy.
            </span>
          </h1>

          <div className="inline-flex items-center gap-3 text-xs tracking-wider uppercase font-mono">
            <span className={`px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-white/20 bg-white/5 text-gray-300' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>
              KPILOT (kpilot.in)
            </span>
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}>·</span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
              LAST UPDATED: OCTOBER 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-28">
        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        <section className="py-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="font-mono text-sm text-indigo-400">01</span>
              Overview & Scope
            </h2>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              Welcome to <strong>KPILOT</strong> ("we", "our", or "us"). KPILOT provides an autonomous marketing automation platform integrating with Meta Platforms (Facebook & Instagram Ads). This Privacy Policy explains how we collect, store, use, and protect your information when you access our website (<a href="https://adds.proteinsolution.in" className="text-indigo-400 underline">adds.proteinsolution.in</a>) and use our Meta ad management services.
            </p>
          </div>

          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="font-mono text-sm text-indigo-400">02</span>
              Information We Collect & Meta API Data
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              When you use KPILOT and connect your Meta account via Facebook Login / Meta OAuth, we collect:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-base leading-relaxed">
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Account Details:</strong> Name, email address, and profile identifiers provided during login.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Meta Advertising Assets:</strong> Ad account IDs, Facebook Page IDs, and Instagram Business Account details you explicitly choose to manage.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Campaign Performance Metrics:</strong> Aggregate ad spend, impressions, clicks, Cost Per Lead (CPL), and Return on Ad Spend (ROAS).
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Lead Form Data:</strong> Leads received via Meta Instant Forms or Instagram direct messages to be displayed in your private dashboard.
              </li>
            </ul>
          </div>

          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="font-mono text-sm text-indigo-400">03</span>
              How We Use Your Information
            </h2>
            <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              We use collected information solely for:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-base leading-relaxed">
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                Launching, editing, and managing your Meta ad campaigns as instructed by you.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                Generating customized creative copy and visual recommendations using AI.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                Syncing leads directly to your dashboard for fast customer response.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                Ensuring compliance with Meta Platform Terms and Advertising Policies.
              </li>
            </ul>
          </div>

          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="font-mono text-sm text-indigo-400">04</span>
              User Data Deletion & Retention
            </h2>
            <p className={`text-base leading-relaxed mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              In compliance with Meta Platform Policies and Data Protection regulations:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-base leading-relaxed">
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Disconnecting Permissions:</strong> You can revoke KPILOT access anytime from your Facebook Settings ➡️ Apps and Websites.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Requesting Data Deletion:</strong> You can submit a full data deletion request by emailing{' '}
                <a href="mailto:support@kpilot.in" className="text-indigo-400 underline">support@kpilot.in</a>. All your stored tokens, leads, and account records will be permanently erased within 72 hours.
              </li>
              <li className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                <strong>Data Deletion Instructions:</strong> Visit our{' '}
                <Link to="/data-security" className="text-indigo-400 underline">Data Security & Deletion Page</Link> for detailed steps.
              </li>
            </ul>
          </div>

          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="font-mono text-sm text-indigo-400">05</span>
              Data Protection & Zero Third-Party Selling
            </h2>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              We <strong>do not sell, rent, or trade</strong> your advertising, audience, or lead data to any third-party data brokers or advertisers. All data is encrypted in transit using TLS 1.3/HTTPS and at rest using AES-256 encryption.
            </p>
          </div>

          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="font-mono text-sm text-indigo-400">06</span>
              Contact Us
            </h2>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              For any questions regarding this Privacy Policy or your data privacy rights, please contact our Data Protection Officer at:
              <br />
              <strong>Email:</strong> <a href="mailto:support@kpilot.in" className="text-indigo-400 underline">support@kpilot.in</a>
              <br />
              <strong>Website:</strong> <a href="https://adds.proteinsolution.in" className="text-indigo-400 underline">https://adds.proteinsolution.in</a>
            </p>
          </div>
        </section>
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
            <Link to="/privacy" className="text-indigo-400 font-semibold transition-colors">Privacy Policy</Link>
            <Link to="/data-security" className="hover:text-indigo-400 transition-colors">Data Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

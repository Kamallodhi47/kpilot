import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Shield, Sun, Moon } from 'lucide-react';

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-orange-500/10 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Our priority, your{' '}
            <span 
              className="italic font-serif bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 bg-clip-text text-transparent inline-block pr-1"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              protection.
            </span>
          </h1>

          {/* Meta Tag Pill & Date */}
          <div className="inline-flex items-center gap-3 text-xs tracking-wider uppercase font-mono">
            <span className={`px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-white/20 bg-white/5 text-gray-300' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>
              DATA SECURITY
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

        {/* SECTION 01: Introduction */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">01</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Introduction</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            NYX.today recognises the critical role data security plays in maintaining user trust and brand partnerships. This Data Security Policy outlines our comprehensive approach to protecting the data entrusted to us by our users and brand partners. We are committed to exceeding industry standards and adhering to all applicable Indian laws and regulations, including the Information Technology Act, 2000 (IT Act) and its amendments.
          </p>

          <h3 className="text-lg font-semibold mb-3">Scope</h3>
          <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            This policy applies to all data collected, processed, and stored by NYX.today across our platforms and services. This includes:
          </p>

          <ul className="space-y-3 mb-10 pl-1">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>User Data: </strong>
                Information we collect during registration and use of our services, such as names, email addresses, phone numbers (if applicable), content creation preferences, and usage data.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Content Data: </strong>
                Text, music, static graphics (images, logos), and video content uploaded by users or generated by NYX AI platforms. Ownership of content remains with the user, but NYX requires temporary access for processing and delivery.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Brand Data: </strong>
                Information provided by brands and advertisers, including campaign details, target audience data, brand assets (logos, images), and performance metrics.
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-4">Disclosure around data retention and deletion for Google user data</h3>
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We store your personal information for a period of time that is consistent with our business purposes.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">02</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                When the data retention period expires for your data, we will delete or destroy it.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">03</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Some data can be deleted by writing a mail to us at{' '}
                <a href="mailto:support@nyx.today" className="text-indigo-400 underline hover:text-indigo-300">
                  support@nyx.today
                </a>{' '}
                stating your intent for data erasure and we will comply accordingly.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">04</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Some data we retain for longer periods of time when necessary for legitimate business or legal purposes, such as security, fraud and abuse prevention.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Disclosure around data sharing of Google user data</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We do not transfer or disclose your information to third parties. You can control your privacy settings and manage how your data is shared through your Google Account settings.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 02: Use of Google Workspace APIs */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">02</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Use of Google Workspace APIs</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            Our application integrates with Google Workspace APIs to provide enhanced functionality to users. We affirm the following regarding the use of these APIs:
          </p>

          <h3 className="text-lg font-semibold mb-3">Data Usage</h3>
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We do not use data obtained through Google Workspace APIs for the development, improvement, or training of generalised artificial intelligence (AI) or machine learning (ML) models.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Purpose of Data Access</h3>
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                The data accessed via Google Workspace APIs is strictly utilised for providing services directly related to the application's core functionality and improving the user experience within the specified scope of the application.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Compliance</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-400 mt-1">01</span>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                We comply with all requirements outlined by Google for the responsible use of Workspace APIs and ensure that data usage aligns with Google's API Services User Data Policy.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 03: Data Security Measures */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">03</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Security Measures</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            NYX.today implements a multi-layered security program to safeguard data throughout its lifecycle, from collection to storage and disposal. These measures include:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Access Controls</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Strong authentication mechanisms like multi-factor authentication (MFA) with one-time passwords (OTP) for added security control user access to NYX platforms. Access privileges are granted on a least-privilege basis, ensuring users only access data necessary for their specific roles. User activity is logged and monitored for suspicious behaviour.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Encryption</h3>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Data is encrypted at rest using industry-standard algorithms like AES-256, rendering it unreadable even if breached. Data is also encrypted in transit using protocols like HTTPS to ensure secure transfer between user devices and NYX servers.
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
                All NYX.today employees undergo comprehensive training on data security best practices and procedures, including data handling, user privacy, and incident response protocols.
              </p>
            </div>
          </div>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 04: Security of AI Models and Tech Stack */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">04</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Security of AI Models and Tech Stack</h2>
          </div>

          <p className={`text-base leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            NYX.today understands the unique security considerations of AI models and the tech stack that powers them. We implement the following measures to ensure the security and responsible development of our AI:
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
                NYX.today software developers adhere to secure coding practices to minimise vulnerabilities in our codebase. This includes following secure coding guidelines and using static code analysis tools.
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

        {/* SECTION 05: Data Breach Notification */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">05</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Breach Notification</h2>
          </div>

          <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            In the event of a data breach, NYX.today will take immediate action to contain the breach, investigate the incident, and determine the scope of the issue. We will notify affected individuals and regulatory authorities as required by law. The notification will include details of the breach, the data involved, and steps taken to mitigate the risk.
          </p>
        </section>

        <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />

        {/* SECTION 06: Compliance with Indian Laws and Regulations */}
        <section className="py-12">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-mono text-sm font-semibold tracking-wider text-blue-400">06</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Compliance with Indian Laws and Regulations</h2>
          </div>

          <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            NYX.today is committed to complying with all applicable Indian laws and regulations regarding data protection and privacy. This includes, but is not limited to:
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
          </ul>
        </section>

        {/* Bottom Help Notice */}
        <div className={`border-t pt-8 text-center text-sm ${theme === 'dark' ? 'border-white/10 text-gray-400' : 'border-slate-200 text-slate-600'}`}>
          Questions about how we protect your data? Reach out at{' '}
          <a href="mailto:support@nyx.today" className="text-indigo-400 underline hover:text-indigo-300 font-medium">
            support@nyx.today
          </a>
          .
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 ${theme === 'dark' ? 'border-white/10 bg-[#040208]' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>© 2026 All Rights Reserved, KPILOT</span>
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

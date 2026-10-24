import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, HelpCircle, ChevronDown, ChevronUp, Key, Eye, EyeOff, FlaskConical, Copy, Check, RefreshCw, ExternalLink, Lock } from 'lucide-react';

interface MetaConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function MetaConnectModal({ isOpen, onClose, onSuccess }: MetaConnectModalProps) {
  const [activeTab, setActiveTab] = useState<'real' | 'test'>('real');
  const [email, setEmail] = useState('');
  const [metaId, setMetaId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [appInfo, setAppInfo] = useState<{ app_id: string; app_name: string }>({
    app_id: '1603282457939716',
    app_name: 'KPilot'
  });

  // Test User states
  const [testUser, setTestUser] = useState<any | null>(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [isConnectingTest, setIsConnectingTest] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showTestPassword, setShowTestPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessData(null);

      // Fetch dynamic Meta App ID and Name
      fetch('/api/meta/app-info')
        .then(res => res.json())
        .then(data => {
          if (data && data.app_id) {
            setAppInfo(data);
          }
        })
        .catch(() => {});
      
      // Auto-fetch default sandbox test user
      fetch('/api/meta/test-users')
        .then(res => res.json())
        .then(data => {
          if (data && data.sandbox_accounts && data.sandbox_accounts.length > 0 && !testUser) {
            setTestUser(data.sandbox_accounts[0]);
          }
        })
        .catch(() => {});
      
      // Auto-populate logged in user email if available
      const authToken = localStorage.getItem('token');
      fetch('/api/auth/me', {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.email && !email) {
            setEmail(data.email);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch('/api/meta/connect', {
        method: 'POST',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData(data);
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 1200);
      } else {
        setError(data.detail || data.message || 'Direct connect nahi ho paaya.');
      }
    } catch (err: any) {
      setError(err.message || 'Server connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch('/api/meta/oauth/start', {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      });
      const data = await res.json();
      if (res.ok && data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setError(data.detail || data.message || 'Failed to start Meta OAuth authorization.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Meta OAuth.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Apna Mail ID (Email) daalein');
      return;
    }
    if (!metaId.trim()) {
      setError('Apna Meta ID ya Ad Account ID daalein');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch('/api/meta/connect-by-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          email: email.trim(),
          meta_id: metaId.trim(),
          account_name: accountName.trim() || undefined,
          custom_token: customToken.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData(data);
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 1200);
      } else {
        setError(data.detail || 'Meta ID connect nahi ho paayi. Kripya check karein.');
      }
    } catch (err: any) {
      setError(err.message || 'Server connection me samasya aayi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleGenerateTestUser = async () => {
    setIsGeneratingTest(true);
    setError(null);
    try {
      const res = await fetch('/api/meta/test-users/create', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestUser(data);
      } else {
        setError(data.message || 'Dummy user generation failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate dummy user.');
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleConnectTestUser = async () => {
    if (!testUser) return;
    setIsConnectingTest(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch('/api/meta/test-users/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          email: testUser.email,
          access_token: testUser.access_token,
          ad_account_id: testUser.ad_account_id,
          ad_account_name: testUser.ad_account_name || `${appInfo.app_name} Sandbox Ad Account`,
          account_name: testUser.name || `${appInfo.app_name} (Test Account)`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData({
          account_name: data.account_name,
          selected_ad_account_id: data.selected_ad_account_id,
          is_sandbox: true
        });
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 1200);
      } else {
        setError(data.detail || 'Test account connect nahi ho saka.');
      }
    } catch (err: any) {
      setError(err.message || 'Server error while connecting test user.');
    } finally {
      setIsConnectingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-[#5b3af6] to-purple-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full text-indigo-100 font-mono">
                Easy Meta Connection
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Connect Meta Ads
              </h2>
            </div>
          </div>
          <p className="text-xs text-indigo-100/90 leading-relaxed mt-2">
            Apna <strong>Mail ID</strong> aur <strong>Meta ID (Ad Account ID)</strong> daalkar ya <strong>Dummy Test User</strong> se connect karein.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('real'); setError(null); }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'real'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Meta Connect
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('test'); setError(null); }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'test'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
            Dummy Test Account (Sandbox)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successData ? (
            <div className="py-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Meta Connected Successfully!
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Account: <span className="font-semibold text-slate-900">{successData.account_name}</span>
              </p>
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                Connected to: {successData.selected_ad_account_id}
              </div>
            </div>
          ) : activeTab === 'test' ? (
            <div className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {/* Sandbox Info Banner */}
              <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl flex items-start gap-2.5 text-purple-900 text-xs">
                <FlaskConical className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Sandbox Test Mode:</span> Meta dummy account jisme <strong className="text-purple-700">Email, Password aur Ad Account</strong> milega. Bina real paise kharch kiye campaigns test karein.
                </div>
              </div>

              {/* Header with generate button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Dummy Test Credentials
                </span>
                <button
                  type="button"
                  onClick={handleGenerateTestUser}
                  disabled={isGeneratingTest}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingTest ? 'animate-spin' : ''}`} />
                  {isGeneratingTest ? 'Generating...' : '⚡ Generate New Account'}
                </button>
              </div>

              {testUser ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 font-mono text-xs">
                  {/* Dummy Email */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block mb-1">
                      Dummy Email
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-800 font-semibold truncate select-all">{testUser.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(testUser.email, 'email')}
                        className="text-slate-400 hover:text-indigo-600 ml-2 cursor-pointer transition-colors"
                        title="Copy Email"
                      >
                        {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Dummy Password */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block mb-1">
                      Dummy Password
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-800 font-semibold select-all">
                        {showTestPassword ? testUser.password : '••••••••••••'}
                      </span>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          type="button"
                          onClick={() => setShowTestPassword(!showTestPassword)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showTestPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(testUser.password, 'pass')}
                          className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                          title="Copy Password"
                        >
                          {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dummy Ad Account ID */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block mb-1">
                      Sandbox Ad Account ID
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-800 font-semibold select-all">{testUser.ad_account_id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(testUser.ad_account_id, 'ad_acc')}
                        className="text-slate-400 hover:text-indigo-600 ml-2 cursor-pointer transition-colors"
                        title="Copy Ad Account ID"
                      >
                        {copiedField === 'ad_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Access Token (Masked) */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block mb-1">
                      Test Access Token
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-500 text-[11px] truncate select-all">{testUser.access_token}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(testUser.access_token, 'token')}
                        className="text-slate-400 hover:text-indigo-600 ml-2 cursor-pointer transition-colors"
                        title="Copy Access Token"
                      >
                        {copiedField === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Login Link if provided by Meta */}
                  {testUser.login_url && (
                    <div className="pt-1">
                      <a
                        href={testUser.login_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold font-sans underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Facebook Test User Login URL
                      </a>
                    </div>
                  )}

                  {/* 1-Click Connect Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleConnectTestUser}
                      disabled={isConnectingTest}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-purple-200 shrink-0" />
                      {isConnectingTest ? 'Connecting Test Session...' : '🚀 1-Click Connect Dummy Account to Dashboard'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <FlaskConical className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-slate-600 font-medium mb-3">No dummy account loaded yet.</p>
                  <button
                    type="button"
                    onClick={handleGenerateTestUser}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
                  >
                    ⚡ Click to Generate Dummy Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Quick Connect & OAuth Options */}
              <div className="space-y-2 pt-1">
                {/* 1-Click System Quick Connect */}
                <button
                  type="button"
                  onClick={handleQuickConnect}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
                  Quick Connect App ({appInfo.app_name} - App ID: {appInfo.app_id})
                </button>

                {/* 1-Click Official Meta OAuth Button */}
                <button
                  type="button"
                  onClick={handleOAuthConnect}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Connect via Facebook Login (OAuth)
                </button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white px-3">
                    Or connect with your Custom Account ID
                  </div>
                </div>
              </div>

              {/* Mail ID Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Mail ID (Email) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>

              {/* Meta ID / Ad Account ID Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Meta App ID / Ad Account ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={metaId}
                  onChange={(e) => setMetaId(e.target.value)}
                  placeholder={`e.g. ${appInfo.app_id} ya act_560854715006518`}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none font-mono transition-all"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Apna Meta App ID (<strong>{appInfo.app_id}</strong>) ya Ads Manager Ad Account ID daalein.
                </span>
              </div>

              {/* Where to find Meta ID? Guide Accordion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    Meta ID kahan milegi? (Asan tareeqa)
                  </span>
                  {showHelp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showHelp && (
                  <div className="px-4 pb-3.5 pt-1 text-[11px] text-slate-600 space-y-2 border-t border-slate-200/60 bg-white">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                      <span>Apna <strong>Meta Ads Manager</strong> (adsmanager.facebook.com) kholein.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                      <span>Upar header me account dropdown par click karein, wahan <strong>Account # (e.g. 1441161704572702)</strong> dikh jayega.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                      <span>Wahi number copy karke yahan paste karein aur Connect par click karein!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Advanced Settings (for custom token) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                >
                  <Key className="w-3 h-3" />
                  {showAdvanced ? 'Hide Advanced Options' : 'Advanced: Custom Access Token (Optional)'}
                </button>

                {showAdvanced && (
                  <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        value={customToken}
                        onChange={(e) => setCustomToken(e.target.value)}
                        placeholder="Custom Meta Access Token (optional)"
                        className="w-full px-3 py-2 pr-9 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Khali chhodne par system ka pre-configured secure Meta Token automatically use hoga.
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5b3af6] hover:from-indigo-700 hover:to-[#4a2ce0] text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Connect Meta Ads
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

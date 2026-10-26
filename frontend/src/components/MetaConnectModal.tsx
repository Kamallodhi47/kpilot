import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, HelpCircle, 
  ChevronDown, ChevronUp, Key, Eye, EyeOff, FlaskConical, Copy, 
  Check, RefreshCw, ExternalLink, Globe, Clipboard
} from 'lucide-react';

interface MetaConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialTab?: 'manual' | 'oauth' | 'sandbox';
}

export function MetaConnectModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialTab = 'manual' 
}: MetaConnectModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'oauth' | 'sandbox'>(initialTab);
  
  // Manual Connect Fields
  const [accessToken, setAccessToken] = useState('');
  const [adAccountId, setAdAccountId] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  
  // App Info
  const [appInfo, setAppInfo] = useState<{ app_id: string; app_name: string }>({
    app_id: '1603282457939716',
    app_name: 'KPilot'
  });

  // Sandbox Test User states
  const [testUser, setTestUser] = useState<any | null>(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [isConnectingTest, setIsConnectingTest] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showTestPassword, setShowTestPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessData(null);
      setActiveTab(initialTab);

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
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // 1. MANUAL TOKEN & AD ACCOUNT ID SUBMIT (Tareeqa B - 100% Guaranteed)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const tokenToSubmit = accessToken.trim();
    if (!tokenToSubmit) {
      setError('Meta Access Token daalna zaroori hai.');
      return;
    }

    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('token');
      const formattedAdId = adAccountId.trim()
        ? (adAccountId.trim().startsWith('act_') ? adAccountId.trim() : `act_${adAccountId.trim()}`)
        : undefined;

      const res = await fetch('/api/meta/connect-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          access_token: tokenToSubmit,
          ad_account_id: formattedAdId
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData(data);
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 1300);
      } else {
        setError(data.detail || data.message || 'Meta account connect nahi ho saka. Kripya Token aur Ad Account ID check karein.');
      }
    } catch (err: any) {
      setError(err.message || 'Server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Auto-fill with Server Pre-configured Token (For instant 1-click test)
  const handleAutoFillServerToken = async () => {
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
        }, 1300);
      } else {
        setError(data.detail || data.message || 'Pre-configured token connect nahi ho paaya.');
      }
    } catch (err: any) {
      setError(err.message || 'Server error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setAccessToken(text.trim());
      }
    } catch (e) {
      // Clipboard permission denied or unsupported
    }
  };

  // 2. OFFICIAL FACEBOOK OAUTH LOGIN (Tareeqa A)
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

  // 3. SANDBOX TEST USER
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
        }, 1300);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-[#5b3af6] to-purple-700 p-5 sm:p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full text-indigo-100 font-mono">
                100% Guaranteed Setup
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Connect Meta Ads Account
              </h2>
            </div>
          </div>
          <p className="text-xs text-indigo-100/90 leading-relaxed mt-2">
            Apna <strong>Meta Access Token</strong> aur <strong>Ad Account ID</strong> daalkar direct connect karein bina kisi Meta App Review restriction ke.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 gap-1.5 sm:gap-2 shrink-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => { setActiveTab('manual'); setError(null); }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manual'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Manual Token & ID (Guaranteed)
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('oauth'); setError(null); }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'oauth'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Facebook Login (OAuth)
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('sandbox'); setError(null); }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
            Dummy Sandbox
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {successData ? (
            <div className="py-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Meta Connected Successfully!
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Account: <span className="font-semibold text-slate-900">{successData.account_name}</span>
              </p>
              <div className="inline-block px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200 font-mono">
                Active Ad Account: {successData.selected_ad_account_name || successData.selected_ad_account_id}
              </div>
            </div>
          ) : activeTab === 'manual' ? (
            /* ================= TAB 1: MANUAL TOKEN & ID (TAREEQA B) ================= */
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs leading-relaxed animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Informative Banner */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>No App Review Required:</strong> Meta Token daalte hi aapka Ad Account turant live bind ho jayega.
                </span>
              </div>

              {/* Meta Access Token Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    Meta Access Token <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Clipboard className="w-3 h-3" /> Paste Token
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    required
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="EAAWyLUlhTwQBS... (Graph API Explorer ya System User Token)"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute top-2.5 right-3 text-slate-400 hover:text-slate-600"
                    title={showToken ? 'Hide token' : 'Show token'}
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  User Access Token ya Business Manager System User Token yahan paste karein.
                </span>
              </div>

              {/* Ad Account ID Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Meta Ad Account ID
                </label>
                <input
                  type="text"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                  placeholder="e.g. act_560854715006518 ya 560854715006518"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none font-mono transition-all"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Optional: Khali chhodne par aapke Token se accessible Ad Accounts auto-detect ho jayenge.
                </span>
              </div>

              {/* Quick Guide Accordion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    Token aur Ad Account ID kahan milegi? (3 Aasan Steps)
                  </span>
                  {showGuide ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showGuide && (
                  <div className="px-4 pb-3.5 pt-1 text-[11px] text-slate-600 space-y-2.5 border-t border-slate-200 bg-white">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                      <div>
                        <span>
                          <strong>Access Token ke liye:</strong>{' '}
                          <a 
                            href="https://developers.facebook.com/tools/explorer/" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-0.5"
                          >
                            Meta Graph API Explorer <ExternalLink className="w-3 h-3" />
                          </a>{' '}
                          kholein, permissions me <code>ads_management</code> aur <code>ads_read</code> select karke <strong>Generate Access Token</strong> dabayein.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                      <div>
                        <span>
                          <strong>Ad Account ID ke liye:</strong>{' '}
                          <a 
                            href="https://adsmanager.facebook.com/" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-0.5"
                          >
                            Meta Ads Manager <ExternalLink className="w-3 h-3" />
                          </a>{' '}
                          kholein. Upar URL me <code>act=XXXXXXXXXX</code> dikhega, wahi number copy karein.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                      <span>Dono details yahan paste karein aur <strong>Connect Account</strong> dabayein!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleAutoFillServerToken}
                  disabled={isLoading}
                  className="w-full sm:w-auto text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 cursor-pointer py-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Use Pre-configured Server Token
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#5b3af6] hover:from-indigo-700 hover:to-[#4a2ce0] text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Verifying with Meta...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Connect Meta Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'oauth' ? (
            /* ================= TAB 2: OAUTH LOGIN ================= */
            <div className="space-y-4 py-2">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="w-14 h-14 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Official Facebook Login for Business
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Meta OAuth popup open hoga jisme aap apne Facebook account se login karke campaigns aur ad accounts ki permission grant kar sakte hain.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOAuthConnect}
                    disabled={isLoading}
                    className="w-full py-3 px-5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    <span>Continue with Facebook Login</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                <strong>Important Note:</strong> Agar aapka Meta App abhi <em>Development Mode</em> me hai, to sirf Meta Console me added <strong>Testers / Developers</strong> hi is button se login kar payenge. Baki users ke liye <strong>Manual Token & ID</strong> tab 100% kaam karega.
              </div>
            </div>
          ) : (
            /* ================= TAB 3: DUMMY SANDBOX ================= */
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-start gap-2.5 text-purple-900 text-xs">
                <FlaskConical className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Sandbox Test Mode:</span> Real paise kharch kiye bina test campaigns chalane ke liye dummy test account use karein.
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Test Credentials
                </span>
                <button
                  type="button"
                  onClick={handleGenerateTestUser}
                  disabled={isGeneratingTest}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingTest ? 'animate-spin' : ''}`} />
                  {isGeneratingTest ? 'Generating...' : '⚡ Generate New'}
                </button>
              </div>

              {testUser ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 font-mono text-xs">
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

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block mb-1">
                      Dummy Password
                    </span>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-800 font-semibold select-all">
                        {showTestPassword ? testUser.password : '••••••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowTestPassword(!showTestPassword)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                      >
                        {showTestPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConnectTestUser}
                      disabled={isConnectingTest}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-purple-200 shrink-0" />
                      {isConnectingTest ? 'Connecting...' : '🚀 Connect Sandbox Account'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-500 mb-2">No test account generated yet.</p>
                  <button
                    type="button"
                    onClick={handleGenerateTestUser}
                    className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
                  >
                    Generate Test Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

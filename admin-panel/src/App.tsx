import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Megaphone,
  Layers,
  Settings,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Trash2,
  Download,
  Key,
  Database,
  Activity,
  LogOut,
  ExternalLink,
  Lock,
  Mail,
  Zap,
  Globe,
  Plus,
  UserCheck,
  UserX
} from 'lucide-react';

interface UserItem {
  id: number;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  is_meta_connected: boolean;
  meta_account_name?: string;
  selected_ad_account_id?: string;
  selected_ad_account_name?: string;
  campaigns_count: number;
  leads_count: number;
  created_at?: string;
}

interface CampaignItem {
  id: number;
  user_id: number;
  user_email: string;
  name: string;
  objective: string;
  daily_budget: number;
  status: string;
  ad_account_id?: string;
  meta_campaign_id?: string;
  created_at?: string;
}

interface LeadItem {
  id: number;
  user_id: number;
  user_email: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  campaign_name?: string;
  lead_type?: string;
  status: string;
  created_at?: string;
}

interface SystemStats {
  users: { total: number; active: number; connected_meta: number };
  campaigns: { total: number; active: number; paused: number };
  leads: { total: number; converted: number };
  system: {
    meta_app_id: string;
    meta_app_name: string;
    has_system_token: boolean;
    has_app_secret: boolean;
    frontend_url: string;
  };
}

export default function AdminApp() {
  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('kpilot_api_url') || 'http://127.0.0.1:8000');
  const [token, setToken] = useState<string>(() => localStorage.getItem('kpilot_admin_token') || '');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSecret, setLoginSecret] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'users' | 'overview' | 'campaigns' | 'leads' | 'settings'>('users');

  // Data states
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [userMetaFilter, setUserMetaFilter] = useState<'all' | 'connected' | 'unconnected'>('all');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');

  // Diagnostic Test State
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagResult, setDiagResult] = useState<any>(null);

  // Settings form state
  const [formSettings, setFormSettings] = useState({
    fb_app_id: '',
    fb_app_secret: '',
    meta_access_token: '',
    frontend_url: 'http://localhost:3000',
    meta_webhook_verify_token: 'kpilot_lead_webhook_2026'
  });

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // Helper fetch with Token and optional X-Admin-Key
  const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
    const cleanBase = apiUrl.replace(/\/+$/, '');
    const url = `${cleanBase}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Admin-Key': 'kpilot_admin_2026', // Always allow Master Admin Key bypass
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {})
    };

    return fetch(url, { ...options, headers });
  };

  // Verify auth on mount
  useEffect(() => {
    const initAuth = async () => {
      setAuthLoading(true);
      try {
        // Attempt quick ping using Master Key or existing token
        const res = await adminFetch('/api/admin/stats');
        if (res.ok) {
          const statsData = await res.json();
          setStats(statsData);
          setIsAuthenticated(true);
          setAdminUser({ email: 'SuperAdmin (Master Access)', is_admin: true });
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [token, apiUrl]);

  // Load active tab data
  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (activeTab === 'users' || activeTab === 'overview') {
        const [resUsers, resStats] = await Promise.all([
          adminFetch('/api/admin/users'),
          adminFetch('/api/admin/stats')
        ]);
        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.users || []);
        }
        if (resStats.ok) {
          const data = await resStats.json();
          setStats(data);
        }
      }

      if (activeTab === 'campaigns') {
        const res = await adminFetch('/api/admin/campaigns');
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      }

      if (activeTab === 'leads') {
        const res = await adminFetch('/api/admin/leads');
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      }

      if (activeTab === 'settings') {
        const res = await adminFetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setFormSettings({
            fb_app_id: data.fb_app_id || '',
            fb_app_secret: '',
            meta_access_token: '',
            frontend_url: data.frontend_url || 'http://localhost:3000',
            meta_webhook_verify_token: data.meta_webhook_verify_token || 'kpilot_lead_webhook_2026'
          });
        }
      }
    } catch (err: any) {
      notify(`Failed to fetch data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated]);

  // Handle Login
  const handleLogin = async (e?: React.FormEvent, isMasterClick = false) => {
    if (e) e.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');

    try {
      const payload: any = {};
      if (isMasterClick) {
        payload.admin_key = 'kpilot_admin_2026';
      } else if (loginSecret.trim()) {
        payload.admin_key = loginSecret.trim();
      } else {
        payload.email = loginEmail.trim();
        payload.password = loginPassword;
      }

      const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(err.detail || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('kpilot_admin_token', data.access_token);
      setToken(data.access_token);
      setAdminUser(data.user);
      setIsAuthenticated(true);
      notify('Logged in successfully as Administrator!');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kpilot_admin_token');
    setToken('');
    setIsAuthenticated(false);
    setAdminUser(null);
    notify('Logged out from Admin Portal.');
  };

  // User Actions
  const toggleUserAdmin = async (userId: number, currentRole: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/toggle-admin`, { method: 'POST' });
      if (res.ok) {
        notify(`User #${userId} role updated to ${!currentRole ? 'Admin' : 'User'}`);
        loadData();
      } else {
        notify('Failed to update user role', 'error');
      }
    } catch (e: any) {
      notify(e.message, 'error');
    }
  };

  const toggleUserActive = async (userId: number, currentActive: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/toggle-active`, { method: 'POST' });
      if (res.ok) {
        notify(`User #${userId} account ${!currentActive ? 'Activated' : 'Suspended'}`);
        loadData();
      } else {
        notify('Failed to change user status', 'error');
      }
    } catch (e: any) {
      notify(e.message, 'error');
    }
  };

  const disconnectUserMeta = async (userId: number) => {
    if (!window.confirm(`Are you sure you want to disconnect Meta account for User #${userId}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/disconnect-meta`, { method: 'POST' });
      if (res.ok) {
        notify(`Disconnected Meta account for User #${userId}`);
        loadData();
      }
    } catch (e: any) {
      notify(e.message, 'error');
    }
  };

  const deleteUser = async (userId: number, userEmail: string) => {
    if (!window.confirm(`CAUTION: Permanently delete user ${userEmail} (ID: ${userId}) and all their campaigns/leads?`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        notify(`User ${userEmail} deleted successfully.`);
        loadData();
      } else {
        notify('Failed to delete user.', 'error');
      }
    } catch (e: any) {
      notify(e.message, 'error');
    }
  };

  // Campaign Actions
  const toggleCampaignStatus = async (campaignId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await adminFetch(`/api/admin/campaigns/${campaignId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        notify(`Campaign #${campaignId} status changed to ${nextStatus}`);
        loadData();
      }
    } catch (e: any) {
      notify(e.message, 'error');
    }
  };

  // Diagnostic Test
  const runDiagnostic = async () => {
    setDiagRunning(true);
    setDiagResult(null);
    try {
      const res = await adminFetch('/api/admin/settings/test-meta', { method: 'POST' });
      const data = await res.json();
      setDiagResult(data);
      if (data.is_healthy) {
        notify('Meta Graph API & App Verified Successfully!');
      } else {
        notify('Meta Diagnostic Warning: Check results below.', 'error');
      }
    } catch (e: any) {
      notify(`Diagnostic Failed: ${e.message}`, 'error');
    } finally {
      setDiagRunning(false);
    }
  };

  // Save Settings
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(formSettings)
      });
      if (res.ok) {
        const data = await res.json();
        notify(data.message || 'Settings saved successfully!');
        loadData();
      } else {
        notify('Failed to save settings', 'error');
      }
    } catch (e: any) {
      notify(e.message, 'error');
    }
  };

  // Export Leads to CSV
  const exportLeadsCsv = () => {
    if (leads.length === 0) {
      notify('No leads to export', 'error');
      return;
    }
    const headers = ['ID', 'User Email', 'Name', 'Phone', 'Email', 'City', 'Campaign', 'Lead Type', 'Status', 'Date'];
    const rows = leads.map(l => [
      l.id,
      `"${l.user_email}"`,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.city || ''}"`,
      `"${l.campaign_name || ''}"`,
      `"${l.lead_type || ''}"`,
      `"${l.status || ''}"`,
      `"${l.created_at || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kpilot_all_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${leads.length} leads to CSV.`);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      String(u.id).includes(userSearch) ||
      (u.selected_ad_account_id && u.selected_ad_account_id.includes(userSearch));

    const matchesRole = userRoleFilter === 'all' ? true : userRoleFilter === 'admin' ? u.is_admin : !u.is_admin;
    const matchesMeta = userMetaFilter === 'all' ? true : userMetaFilter === 'connected' ? u.is_meta_connected : !u.is_meta_connected;

    return matchesSearch && matchesRole && matchesMeta;
  });

  // Filtered Campaigns
  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
    c.user_email.toLowerCase().includes(campaignSearch.toLowerCase()) ||
    c.objective.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  // Filtered Leads
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.phone.includes(leadSearch) ||
    l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.user_email.toLowerCase().includes(leadSearch.toLowerCase()) ||
    (l.campaign_name && l.campaign_name.toLowerCase().includes(leadSearch.toLowerCase()))
  );

  // ================= RENDER: AUTH GATE =================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-gray-400 font-semibold tracking-wide">Connecting to KPilot Backend API...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090d] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#12131a] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="font-black text-2xl text-white">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                KPILOT <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">PORTAL</span>
              </h1>
              <p className="text-xs text-gray-400">Standalone Central Admin Panel</p>
            </div>
          </div>

          <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl mb-6 text-xs text-purple-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-300">Decoupled Admin System</p>
              <p className="text-gray-400 mt-0.5">Running on dedicated port with direct REST API connection to backend engine.</p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl mb-4 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* 1-Click Master Access Button */}
          <button
            onClick={() => handleLogin(undefined, true)}
            disabled={loginSubmitting}
            className="w-full py-3.5 px-4 mb-5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>⚡ 1-Click Master Admin Access</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#12131a] px-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">Or Login with Credentials</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="admin@kpilot.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Or Master Admin Passkey</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={loginSecret}
                  onChange={e => setLoginSecret(e.target.value)}
                  placeholder="kpilot_admin_2026"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Configurable Backend Target */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Backend API Target</label>
              <input
                type="text"
                value={apiUrl}
                onChange={e => {
                  setApiUrl(e.target.value);
                  localStorage.setItem('kpilot_api_url', e.target.value);
                }}
                className="w-full bg-black/20 border border-white/5 rounded-lg py-1.5 px-3 text-xs text-gray-400 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {loginSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-purple-400" />}
              <span>Sign In to Admin Portal</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= RENDER: AUTHENTICATED ADMIN PORTAL =================
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-[#0d0e15]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20">
              <span className="font-black text-lg text-white">K</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wide text-white">KPILOT ADMIN</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PORT 3001
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Master Governance Console</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-white/10 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Connected: {apiUrl}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Database Users: {users.length || stats?.users.total || 0}
            </span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/5 transition-all"
          >
            <span>Open Client App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`py-2 px-6 text-xs font-semibold flex items-center justify-between transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-500/30'
              : 'bg-red-950/80 text-red-300 border-b border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-[#0d0e15] border-r border-white/10 flex flex-col shrink-0 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>All Database Users</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-mono font-bold">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Megaphone className="w-4 h-4" />
              <span>Global Campaigns</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono">
              {campaigns.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Central Leads Hub</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Meta & System Config</span>
          </button>

          {/* Quick System Info in sidebar footer */}
          <div className="mt-auto pt-6 border-t border-white/5 text-[11px] text-gray-500 space-y-2">
            <div className="flex justify-between">
              <span>Meta App:</span>
              <span className="text-gray-300 font-semibold">{stats?.system.meta_app_name || 'KPILOT'}</span>
            </div>
            <div className="flex justify-between">
              <span>App ID:</span>
              <span className="font-mono text-gray-300">{stats?.system.meta_app_id || '1603282457939716'}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Port:</span>
              <span className="font-mono text-purple-400">3001</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#090a0f]">
          {/* TAB 1: ALL DATABASE USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span>Database Users Management</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Live list of all <strong>{users.length} registered users</strong> in the database with role and account governance.
                  </p>
                </div>

                {/* Quick Summary Pill */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                    {users.filter(u => u.is_admin).length} Admins
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    {users.filter(u => u.is_meta_connected).length} Meta Connected
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                    {users.filter(u => u.is_active).length} Active
                  </span>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 bg-[#11121a] p-3.5 rounded-2xl border border-white/10">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users by email, user ID, or Ad Account..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value as any)}
                    className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins Only</option>
                    <option value="user">Regular Users</option>
                  </select>

                  <select
                    value={userMetaFilter}
                    onChange={e => setUserMetaFilter(e.target.value as any)}
                    className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Meta Statuses</option>
                    <option value="connected">Meta Connected</option>
                    <option value="unconnected">Meta Unconnected</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#11121a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Meta Status</th>
                        <th className="py-3.5 px-4">Selected Ad Account</th>
                        <th className="py-3.5 px-4">Campaigns</th>
                        <th className="py-3.5 px-4">Leads</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Account State</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-gray-500">
                            No users found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* User details */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                  {u.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-white flex items-center gap-2">
                                    <span>{u.email}</span>
                                    {u.id === 1 && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        OWNER
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-500 font-mono">ID: #{u.id}</div>
                                </div>
                              </div>
                            </td>

                            {/* Meta Connection */}
                            <td className="py-4 px-4">
                              {u.is_meta_connected ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Connected</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                  <XCircle className="w-3.5 h-3.5 text-gray-500" />
                                  <span>Not Connected</span>
                                </span>
                              )}
                            </td>

                            {/* Selected Ad Account */}
                            <td className="py-4 px-4 text-xs font-mono text-gray-300">
                              {u.selected_ad_account_id ? (
                                <div>
                                  <div className="text-purple-300 font-semibold">{u.selected_ad_account_id}</div>
                                  <div className="text-gray-500 text-[10px] truncate max-w-[150px]">
                                    {u.selected_ad_account_name || 'KPilot Ad Account'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>

                            {/* Campaigns Count */}
                            <td className="py-4 px-4">
                              <span className="font-mono font-semibold text-gray-200">{u.campaigns_count}</span>
                            </td>

                            {/* Leads Count */}
                            <td className="py-4 px-4">
                              <span className="font-mono font-semibold text-gray-200">{u.leads_count}</span>
                            </td>

                            {/* Role Badge */}
                            <td className="py-4 px-4">
                              <button
                                onClick={() => toggleUserAdmin(u.id, u.is_admin)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                  u.is_admin
                                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                                title="Click to toggle Admin / User role"
                              >
                                {u.is_admin ? '🛡️ Admin' : 'User'}
                              </button>
                            </td>

                            {/* Account Active State */}
                            <td className="py-4 px-4">
                              <button
                                onClick={() => toggleUserActive(u.id, u.is_active)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                  u.is_active
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                                title="Click to Suspend or Activate user"
                              >
                                {u.is_active ? 'Active' : 'Suspended'}
                              </button>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {u.is_meta_connected && (
                                  <button
                                    onClick={() => disconnectUserMeta(u.id)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 text-xs transition-colors cursor-pointer"
                                    title="Disconnect Meta Account"
                                  >
                                    Reset Meta
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteUser(u.id, u.email)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="Permanently Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLATFORM OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-purple-400" />
                    <span>Platform Overview & KPIs</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Real-time aggregate analytics across all users and accounts.</p>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#11121a] border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
                    <span>Total Registered Users</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3 font-mono">
                    {stats?.users.total ?? users.length}
                  </div>
                  <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{stats?.users.active ?? users.filter(u => u.is_active).length} Active Accounts</span>
                  </div>
                </div>

                <div className="bg-[#11121a] border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
                    <span>Meta Connected Users</span>
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3 font-mono">
                    {stats?.users.connected_meta ?? users.filter(u => u.is_meta_connected).length}
                  </div>
                  <div className="text-xs text-blue-400 mt-2 font-semibold">
                    Live Meta OAuth Accounts
                  </div>
                </div>

                <div className="bg-[#11121a] border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
                    <span>Total Campaigns</span>
                    <Megaphone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3 font-mono">
                    {stats?.campaigns.total ?? campaigns.length}
                  </div>
                  <div className="text-xs text-amber-400 mt-2 font-semibold">
                    {stats?.campaigns.active ?? 0} Currently Active
                  </div>
                </div>

                <div className="bg-[#11121a] border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
                    <span>Total Leads Captured</span>
                    <Layers className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white mt-3 font-mono">
                    {stats?.leads.total ?? leads.length}
                  </div>
                  <div className="text-xs text-emerald-400 mt-2 font-semibold">
                    {stats?.leads.converted ?? 0} Qualified / Converted
                  </div>
                </div>
              </div>

              {/* System Engine Health Card */}
              <div className="bg-[#11121a] border border-white/10 p-6 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span>Meta Platform Configuration & Core Services</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">Configured Meta App</div>
                    <div className="text-base font-bold text-white">{stats?.system.meta_app_name || 'KPILOT'}</div>
                    <div className="text-xs text-purple-400 font-mono mt-1">ID: {stats?.system.meta_app_id || '1603282457939716'}</div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">Master System Token</div>
                    <div className="flex items-center gap-2 mt-1">
                      {stats?.system.has_system_token ? (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Configured & Loaded
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Token Not Set in .env
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <div className="text-xs text-gray-400 mb-1">Target Frontend Client</div>
                    <div className="text-xs font-mono text-gray-200 mt-1">{stats?.system.frontend_url || 'http://localhost:3000'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-purple-400" />
                    <span>Global Campaigns Monitor</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Direct control to pause, resume, and inspect all user campaigns.</p>
                </div>
              </div>

              {/* Search Toolbar */}
              <div className="relative bg-[#11121a] p-3 rounded-2xl border border-white/10">
                <Search className="w-4 h-4 text-gray-500 absolute left-6 top-5" />
                <input
                  type="text"
                  value={campaignSearch}
                  onChange={e => setCampaignSearch(e.target.value)}
                  placeholder="Search campaigns by name, owner email, or objective..."
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Campaigns Table */}
              <div className="bg-[#11121a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Campaign Name</th>
                        <th className="py-3.5 px-4">Owner Email</th>
                        <th className="py-3.5 px-4">Objective</th>
                        <th className="py-3.5 px-4">Daily Budget</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCampaigns.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-500">
                            No campaigns found.
                          </td>
                        </tr>
                      ) : (
                        filteredCampaigns.map(c => (
                          <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 font-semibold text-white">
                              <div>{c.name}</div>
                              <div className="text-[10px] text-gray-500 font-mono">ID: #{c.id}</div>
                            </td>
                            <td className="py-4 px-4 text-gray-300">{c.user_email}</td>
                            <td className="py-4 px-4">
                              <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-purple-300 font-mono">
                                {c.objective}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono text-emerald-400 font-bold">
                              ₹{c.daily_budget}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                                  c.status === 'ACTIVE'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {c.status === 'ACTIVE' ? <Play className="w-3 h-3 fill-emerald-400" /> : <Pause className="w-3 h-3 fill-amber-400" />}
                                <span>{c.status}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => toggleCampaignStatus(c.id, c.status)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  c.status === 'ACTIVE'
                                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
                                }`}
                              >
                                {c.status === 'ACTIVE' ? 'Pause Campaign' : 'Resume Campaign'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEADS HUB */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-purple-400" />
                    <span>Central Leads Hub</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Aggregated leads collected across all user forms and campaigns.</p>
                </div>

                <button
                  onClick={exportLeadsCsv}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export All to CSV</span>
                </button>
              </div>

              {/* Search Toolbar */}
              <div className="relative bg-[#11121a] p-3 rounded-2xl border border-white/10">
                <Search className="w-4 h-4 text-gray-500 absolute left-6 top-5" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Search leads by name, phone, email, or campaign..."
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Leads Table */}
              <div className="bg-[#11121a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Lead Name</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Owner Account</th>
                        <th className="py-3.5 px-4">Campaign Name</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-500">
                            No leads captured yet.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map(l => (
                          <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 font-semibold text-white">{l.name}</td>
                            <td className="py-4 px-4">
                              <div className="text-xs font-mono text-purple-300">{l.phone}</div>
                              <div className="text-xs text-gray-500">{l.email}</div>
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-300">{l.user_email}</td>
                            <td className="py-4 px-4 text-xs text-gray-300">{l.campaign_name || 'Direct Lead'}</td>
                            <td className="py-4 px-4 text-xs">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">
                                {l.lead_type || 'Lead Form'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {l.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-500 font-mono">
                              {l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: META CONFIGURATION & LIVE DIAGNOSTIC */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-400" />
                  <span>Meta System Settings & Diagnostic</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">Configure master Meta credentials and test Graph API connectivity in real time.</p>
              </div>

              {/* Diagnostic Box */}
              <div className="bg-[#11121a] border border-white/10 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span>Live Meta API Diagnostic</span>
                    </h3>
                    <p className="text-xs text-gray-400">Pings Meta Graph API to verify App ID, Token status, and Ad Accounts.</p>
                  </div>
                  <button
                    onClick={runDiagnostic}
                    disabled={diagRunning}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${diagRunning ? 'animate-spin' : ''}`} />
                    <span>Run Diagnostic Test</span>
                  </button>
                </div>

                {diagResult && (
                  <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Diagnostic Results</span>
                      <span className="text-xs font-mono text-purple-400">{diagResult.latency_ms} ms</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-gray-500 block">App Status:</span>
                        <span className="font-bold text-white">{diagResult.app_status}</span>
                        {diagResult.app_name && <span className="text-purple-400 block mt-0.5">({diagResult.app_name})</span>}
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-gray-500 block">Token Status:</span>
                        <span className="font-bold text-white">{diagResult.token_status}</span>
                        {diagResult.user_name && <span className="text-emerald-400 block mt-0.5">User: {diagResult.user_name}</span>}
                      </div>
                    </div>

                    {diagResult.errors && diagResult.errors.length > 0 && (
                      <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-xs text-red-300">
                        {diagResult.errors.map((err: string, idx: number) => (
                          <div key={idx}>{err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings Form */}
              <form onSubmit={saveSettings} className="bg-[#11121a] border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Platform Credentials</h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Meta App ID (Official: KPILOT)</label>
                  <input
                    type="text"
                    value={formSettings.fb_app_id}
                    onChange={e => setFormSettings({ ...formSettings, fb_app_id: e.target.value })}
                    placeholder="1603282457939716"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Meta App Secret</label>
                  <input
                    type="password"
                    value={formSettings.fb_app_secret}
                    onChange={e => setFormSettings({ ...formSettings, fb_app_secret: e.target.value })}
                    placeholder="Enter new App Secret to update (or leave blank)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Master System Token (Platform Fallback)</label>
                  <input
                    type="password"
                    value={formSettings.meta_access_token}
                    onChange={e => setFormSettings({ ...formSettings, meta_access_token: e.target.value })}
                    placeholder="Enter new Master Meta Access Token"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Client App Frontend URL</label>
                  <input
                    type="text"
                    value={formSettings.frontend_url}
                    onChange={e => setFormSettings({ ...formSettings, frontend_url: e.target.value })}
                    placeholder="http://localhost:3000"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    Save & Update Platform Config
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

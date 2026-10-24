import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Megaphone, 
  ShieldCheck, 
  Settings, 
  Activity, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Globe, 
  RefreshCw, 
  Power, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  FileText,
  Copy,
  Check,
  Zap,
  Radio
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminPanel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'campaigns' | 'leads' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Settings form state
  const [editAppId, setEditAppId] = useState('');
  const [editAppSecret, setEditAppSecret] = useState('');
  const [editMetaToken, setEditMetaToken] = useState('');
  const [editFrontendUrl, setEditFrontendUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingMeta, setIsTestingMeta] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // 1. Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: { ...getAuthHeader() } });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: { ...getAuthHeader() } });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Fetch Campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/campaigns', { headers: { ...getAuthHeader() } });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Fetch Leads
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads', { headers: { ...getAuthHeader() } });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Fetch Settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', { headers: { ...getAuthHeader() } });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setEditAppId(data.fb_app_id || '');
        setEditFrontendUrl(data.frontend_url || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchCampaigns(), fetchLeads(), fetchSettings()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Action Handlers
  const handleToggleAdmin = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        showNotification('User admin role updated successfully!');
        fetchUsers();
      }
    } catch (e) {
      showNotification('Failed to update admin role', 'error');
    }
  };

  const handleToggleActive = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-active`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        showNotification('User status updated successfully!');
        fetchUsers();
      }
    } catch (e) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDisconnectUserMeta = async (userId: number) => {
    if (!window.confirm("Are you sure you want to disconnect Meta for this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/disconnect-meta`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) {
        showNotification('Meta connection removed for user');
        fetchUsers();
      }
    } catch (e) {
      showNotification('Failed to disconnect Meta', 'error');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("CAUTION: This will delete the user and all their campaigns & leads permanently. Proceed?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'User deleted successfully');
        fetchUsers();
        fetchStats();
      } else {
        showNotification(data.detail || 'Could not delete user', 'error');
      }
    } catch (e) {
      showNotification('Failed to delete user', 'error');
    }
  };

  const handleToggleCampaignStatus = async (campId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/campaigns/${campId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showNotification(`Campaign set to ${newStatus}`);
        fetchCampaigns();
        fetchStats();
      }
    } catch (e) {
      showNotification('Failed to update campaign status', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          fb_app_id: editAppId.trim() || undefined,
          fb_app_secret: editAppSecret.trim() || undefined,
          meta_access_token: editMetaToken.trim() || undefined,
          frontend_url: editFrontendUrl.trim() || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'Settings saved successfully!');
        fetchSettings();
        fetchStats();
        setEditAppSecret('');
        setEditMetaToken('');
      } else {
        showNotification(data.detail || 'Failed to save settings', 'error');
      }
    } catch (e) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTestMetaConnection = async () => {
    setIsTestingMeta(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/settings/test-meta', {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      setTestResult(data);
      if (data.is_healthy) {
        showNotification(`Meta Connection Healthy! Verified app: ${data.app_name}`);
      } else {
        showNotification('Meta diagnostics found issues. Check report below.', 'error');
      }
    } catch (e) {
      showNotification('Diagnostic test request failed', 'error');
    } finally {
      setIsTestingMeta(false);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.meta_account_name && u.meta_account_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.selected_ad_account_id && u.selected_ad_account_id.includes(searchTerm))
  );

  const filteredCampaigns = campaigns.filter(c =>
    c.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.ad_account_id && c.ad_account_id.includes(searchTerm))
  );

  return (
    <div className={`p-4 sm:p-8 space-y-6 max-w-7xl mx-auto min-h-screen ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Toast Notification */}
      {statusMessage && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950 border-rose-500/40 text-rose-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <p className="text-xs sm:text-sm font-semibold">{statusMessage.text}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">KPilot Admin Control Center</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest font-mono">
                  Master Console
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-0.5`}>
                Complete administrative control over users, Meta API credentials, campaigns, and platform settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-white/10">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: Activity },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'campaigns', label: `Campaigns (${campaigns.length})`, icon: Megaphone },
          { id: 'leads', label: `Leads (${leads.length})`, icon: TrendingUp },
          { id: 'settings', label: 'Meta & System Settings', icon: Sliders },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Total Registered Users
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black">{stats?.users?.total || 0}</div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-500 font-semibold">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>{stats?.users?.active || 0} active users</span>
                <span className="text-gray-400">•</span>
                <span className="text-purple-400">{stats?.users?.connected_meta || 0} Meta connected</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Meta Campaigns Created
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black">{stats?.campaigns?.total || 0}</div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-500 font-semibold">
                <span>{stats?.campaigns?.active || 0} active</span>
                <span className="text-gray-400">•</span>
                <span className="text-amber-400">{stats?.campaigns?.paused || 0} paused</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Captured Leads
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black">{stats?.leads?.total || 0}</div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-500 font-semibold">
                <span>{stats?.leads?.converted || 0} high-intent converted</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  System Health
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg font-bold text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> 100% Operational
              </div>
              <div className={`mt-2 text-[11px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Meta App: <span className="font-semibold text-purple-400">{stats?.system?.meta_app_name || 'KPILOT'}</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts & Diagnostic Bar */}
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
            <div>
              <h3 className="text-base font-bold">Configured Meta App</h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-0.5`}>
                App ID: <strong className="text-indigo-400">{stats?.system?.meta_app_id}</strong> ({stats?.system?.meta_app_name})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-colors cursor-pointer"
              >
                Configure Meta Credentials
              </button>
              <button
                onClick={handleTestMetaConnection}
                disabled={isTestingMeta}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                  isDark ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {isTestingMeta ? 'Running Diagnostics...' : 'Test Meta Connection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user email or ad account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none transition-all ${
                  isDark ? 'bg-[#151522] border-white/10 text-white focus:border-purple-500' : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>

          <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-gray-400 bg-white/5' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                  <th className="py-3 px-4 font-bold">ID</th>
                  <th className="py-3 px-4 font-bold">User Email</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Meta Connected Account</th>
                  <th className="py-3 px-4 font-bold">Campaigns</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 font-medium">
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold text-gray-400">#{u.id}</td>
                      <td className="py-3 px-4 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{u.email}</span>
                          {u.is_admin && (
                            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAdmin(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                            u.is_admin 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-700' 
                              : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-gray-400 border border-slate-200 dark:border-white/10'
                          }`}
                          title="Click to toggle Admin / User role"
                        >
                          {u.is_admin ? 'Super Admin' : 'Standard User'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(u.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            u.is_active 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                          title="Click to activate / suspend"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {u.is_active ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        {u.is_meta_connected ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-blue-500">{u.meta_account_name || 'Connected'}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{u.selected_ad_account_id}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not Connected</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {u.campaigns_count} campaigns
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.is_meta_connected && (
                            <button
                              onClick={() => handleDisconnectUserMeta(u.id)}
                              className="px-2 py-1 rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-[10px] font-bold cursor-pointer transition-colors"
                              title="Disconnect User Meta"
                            >
                              Disconnect Meta
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                            title="Delete User Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* TAB 3: GLOBAL CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              All User Campaigns Monitor
            </h3>
            <span className="text-xs text-gray-400">{filteredCampaigns.length} total campaigns</span>
          </div>

          <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-gray-400 bg-white/5' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                  <th className="py-3 px-4 font-bold">Campaign Name</th>
                  <th className="py-3 px-4 font-bold">User Email</th>
                  <th className="py-3 px-4 font-bold">Objective</th>
                  <th className="py-3 px-4 font-bold">Ad Account</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 font-medium">
                      No campaigns found.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((c) => (
                    <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-bold">
                        <div>{c.campaign_name}</div>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {c.meta_campaign_id}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{c.user_email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] uppercase font-bold">
                          {c.objective || 'TRAFFIC'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-400">{c.ad_account_id}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleCampaignStatus(c.id, c.status)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            c.status === 'ACTIVE'
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {c.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              All Captured Leads
            </h3>
            <span className="text-xs text-gray-400">{leads.length} total leads collected</span>
          </div>

          <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-gray-400 bg-white/5' : 'border-slate-200 text-slate-600 bg-slate-50'}`}>
                  <th className="py-3 px-4 font-bold">Lead Name</th>
                  <th className="py-3 px-4 font-bold">Contact (Phone/Email)</th>
                  <th className="py-3 px-4 font-bold">Campaign / User</th>
                  <th className="py-3 px-4 font-bold">Channel</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 font-medium">
                      No leads captured yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-bold">{l.name || 'Anonymous'}</td>
                      <td className="py-3 px-4">
                        <div>{l.phone || 'No phone'}</div>
                        <span className="text-gray-400 text-[11px]">{l.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-purple-400">{l.campaign_name}</div>
                        <span className="text-[10px] text-gray-400">{l.user_email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold">
                          {l.lead_type || 'Lead Form'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">{l.status}</td>
                      <td className="py-3 px-4 text-right text-gray-400 font-mono text-[10px]">
                        {l.created_at ? l.created_at.split('T')[0] : 'Today'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: META & SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Form */}
            <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Meta Marketing API Credentials
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} mb-6`}>
                Changes are saved directly into the backend configuration file (.env) and take effect immediately.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                {/* FB_APP_ID */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-slate-500">
                    Meta Facebook App ID
                  </label>
                  <input
                    type="text"
                    value={editAppId}
                    onChange={(e) => setEditAppId(e.target.value)}
                    placeholder="e.g. 1603282457939716"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                {/* FB_APP_SECRET */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-slate-500">
                    Meta Facebook App Secret
                  </label>
                  <input
                    type="password"
                    value={editAppSecret}
                    onChange={(e) => setEditAppSecret(e.target.value)}
                    placeholder={settings?.fb_app_secret_masked ? `Masked: ${settings.fb_app_secret_masked} (Leave empty to keep)` : "Enter App Secret"}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Khali chhodne par current App Secret برقرار rahega.
                  </span>
                </div>

                {/* META_ACCESS_TOKEN */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-slate-500">
                    System Master Meta Access Token
                  </label>
                  <input
                    type="password"
                    value={editMetaToken}
                    onChange={(e) => setEditMetaToken(e.target.value)}
                    placeholder={settings?.meta_access_token_masked ? `Masked: ${settings.meta_access_token_masked} (Leave empty to keep)` : "Enter Access Token"}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                {/* FRONTEND_URL */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 text-slate-500">
                    Frontend URL (for OAuth Callbacks)
                  </label>
                  <input
                    type="text"
                    value={editFrontendUrl}
                    onChange={(e) => setEditFrontendUrl(e.target.value)}
                    placeholder="https://adds.proteinsolution.in ya http://localhost:3000"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Saving Configuration...' : '💾 Save Settings'}
                  </button>

                  <button
                    type="button"
                    onClick={handleTestMetaConnection}
                    disabled={isTestingMeta}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {isTestingMeta ? 'Testing...' : 'Live Test Connection'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right 1 Col: Live Diagnostics */}
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#151522] border-white/10' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Live Meta Diagnostic
              </h4>

              {testResult ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-xl border ${testResult.is_healthy ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                    <div className="font-bold">{testResult.is_healthy ? '✅ All Systems Healthy' : '⚠️ Diagnostic Alerts'}</div>
                    <div className="text-[11px] mt-1">Latency: {testResult.latency_ms} ms</div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">App Verification:</span>
                      <span className="font-bold">{testResult.app_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">App Name:</span>
                      <span className="font-bold text-indigo-400">{testResult.app_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Token Status:</span>
                      <span className="font-bold">{testResult.token_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Accessible Ad Accounts:</span>
                      <span className="font-bold">{testResult.ad_accounts_count} accounts</span>
                    </div>
                  </div>

                  {testResult.errors && testResult.errors.length > 0 && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-[10px]">
                      {testResult.errors.map((err: string, i: number) => (
                        <div key={i}>• {err}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Click "Live Test Connection" to verify Meta App and Access Token health.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

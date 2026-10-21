import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Phone, 
  MessageSquare, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  TrendingUp, 
  AlertCircle, 
  Send, 
  Filter 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  campaign_name: string;
  meta_campaign_id?: string;
  lead_type?: string;
  message_text?: string;
  instagram_username?: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface LeadStats {
  total_leads: number;
  today_leads: number;
  contacted_leads: number;
  converted_leads: number;
  instagram_dms?: number;
}

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export default function Leads() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    total_leads: 0,
    today_leads: 0,
    contacted_leads: 0,
    converted_leads: 0,
    instagram_dms: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [creatingTest, setCreatingTest] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const authHeaders: HeadersInit = token 
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (channelFilter !== 'All') params.append('lead_type', channelFilter);

      const res = await fetch(`/api/leads?${params.toString()}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/leads/stats', { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch lead stats:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [statusFilter, channelFilter]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Update Status
  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        fetchStats();
        showNotification(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: number) => {
    if (!window.confirm('Kya aap is lead ko delete karna chahte hain?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        fetchStats();
        showNotification('Lead successfully delete ho gayi');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Create Sample/Test Lead (Form or Instagram DM)
  const handleCreateTestLead = async (type: 'Lead Form' | 'Instagram DM' = 'Lead Form') => {
    try {
      setCreatingTest(true);
      const res = await fetch('/api/leads/test', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ lead_type: type })
      });
      if (res.ok) {
        fetchLeads();
        fetchStats();
        showNotification(type === 'Instagram DM' ? '📸 New Instagram Video Ad DM lead added!' : '✅ New Form Lead added!');
      }
    } catch (err) {
      console.error('Error creating sample lead:', err);
    } finally {
      setCreatingTest(false);
    }
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('Export karne ke liye koi lead nahi hai.');
      return;
    }

    const headers = ['ID', 'Type', 'Name', 'Instagram Handle', 'Phone', 'Email', 'City', 'Campaign', 'Message / Query', 'Status', 'Date'];
    const rows = leads.map(l => [
      l.id,
      `"${l.lead_type || 'Lead Form'}"`,
      `"${l.name || ''}"`,
      `"${l.instagram_username || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.city || ''}"`,
      `"${l.campaign_name || ''}"`,
      `"${(l.message_text || '').replace(/"/g, '""')}"`,
      `"${l.status || ''}"`,
      `"${l.created_at || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp link
  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Namaste ${name}, humne aapki inquiry dekhi thi. Kya hum iske baare me baat kar sakte hain?`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  // Instagram Direct message link
  const getInstagramLink = (username: string) => {
    const cleanUser = username.replace('@', '').trim();
    return `https://ig.me/m/${cleanUser}`;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'New':
        return isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Qualified':
        return isDark ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Converted':
        return isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost':
        return isDark ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return isDark ? 'bg-gray-500/15 text-gray-400 border-gray-500/30' : 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#7c3aed] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7c3aed]/15 text-[#7c3aed] border border-purple-500/25">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Leads & Instagram DMs</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Meta Ads Form Leads aur Instagram Video Ads ke DMs yahan real-time aate hain
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className={`p-2.5 rounded-xl border transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Test Instagram Video DM */}
          <button
            onClick={() => handleCreateTestLead('Instagram DM')}
            disabled={creatingTest}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              isDark
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20'
                : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
            }`}
            title="Simulate an Instagram Video Ad DM"
          >
            <InstagramIcon className="w-4 h-4 text-pink-500" />
            <span>+ Instagram DM Test</span>
          </button>

          {/* Test Form Lead */}
          <button
            onClick={() => handleCreateTestLead('Lead Form')}
            disabled={creatingTest}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              isDark
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Form Lead Test</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Leads */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Total Inquiries</span>
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{stats.total_leads}</span>
            <span className="text-xs text-emerald-500 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Live
            </span>
          </div>
        </div>

        {/* Instagram Video DMs */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-pink-500/20' : 'bg-white border-pink-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>Instagram DMs</span>
            <div className="p-2 rounded-lg bg-pink-500/15 text-pink-500">
              <InstagramIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-pink-500">{stats.instagram_dms || 0}</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Video Ads DMs</span>
          </div>
        </div>

        {/* Today's Leads */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Today</span>
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{stats.today_leads}</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>New messages</span>
          </div>
        </div>

        {/* Contacted */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>In Progress</span>
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{stats.contacted_leads}</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Active Chats</span>
          </div>
        </div>

        {/* Converted */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Converted</span>
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{stats.converted_leads}</span>
            <span className="text-xs text-purple-500 font-semibold">Closed Deals</span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative w-full lg:w-72">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, DM text, @handle..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
              isDark 
                ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' 
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Channel Filter (All / Instagram DMs / Lead Form) */}
        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <span className={`text-xs font-bold whitespace-nowrap mr-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Channel:</span>
          {[
            { id: 'All', label: 'All Channels' },
            { id: 'Instagram DM', label: '📸 Instagram DMs' },
            { id: 'Lead Form', label: '📋 Lead Forms' }
          ].map(ch => (
            <button
              key={ch.id}
              onClick={() => setChannelFilter(ch.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                channelFilter === ch.id
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-500/25'
                  : isDark 
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <span className={`text-xs font-bold whitespace-nowrap mr-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Status:</span>
          {['All', ...STATUS_OPTIONS].map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === opt
                  ? 'bg-white/20 text-white border border-white/30'
                  : isDark 
                    ? 'bg-white/5 text-gray-400 hover:text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Leads & Messages Table */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${
        isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs uppercase tracking-wider ${
                isDark ? 'border-white/10 bg-white/[0.02] text-gray-400' : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}>
                <th className="py-3.5 px-4 font-bold">Source & Customer</th>
                <th className="py-3.5 px-4 font-bold">Message / Inquiry</th>
                <th className="py-3.5 px-4 font-bold">Campaign</th>
                <th className="py-3.5 px-4 font-bold">Date & Time</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#7c3aed] mb-2" />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Loading inquiries...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 px-4">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-[#7c3aed] flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold">Abhi koi lead ya Instagram DM nahi hai</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        Jaise hi koi customer Instagram Video Ad dekhkar DM karega ya Lead Form bharega, wo yahan live dikhai dega.
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => handleCreateTestLead('Instagram DM')}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md"
                        >
                          <InstagramIcon className="w-3.5 h-3.5" /> Test Instagram Video DM
                        </button>
                        <button
                          onClick={() => handleCreateTestLead('Lead Form')}
                          className="px-4 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Test Lead Form
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Customer & Source */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        {lead.lead_type === 'Instagram DM' ? (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20">
                            <InstagramIcon className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm leading-snug">{lead.name || 'Anonymous User'}</span>
                            {lead.lead_type === 'Instagram DM' ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 border border-pink-500/30">
                                IG DM
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                Form
                              </span>
                            )}
                          </div>
                          
                          {lead.instagram_username && (
                            <a
                              href={getInstagramLink(lead.instagram_username)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-pink-400 hover:underline font-mono block mt-0.5"
                            >
                              @{lead.instagram_username.replace('@', '')}
                            </a>
                          )}

                          {lead.phone && (
                            <div className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">{lead.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Message / Inquiry Content */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {lead.message_text ? (
                        <div className={`p-2.5 rounded-xl text-xs ${
                          isDark ? 'bg-white/5 border border-white/10 text-gray-200' : 'bg-slate-50 border border-slate-200 text-slate-800'
                        }`}>
                          <div className="flex items-center gap-1.5 text-[10px] text-pink-400 font-bold mb-1">
                            <MessageSquare className="w-3 h-3" /> Customer Message:
                          </div>
                          <p className="line-clamp-2 leading-relaxed">"{lead.message_text}"</p>
                        </div>
                      ) : (
                        <div className="text-xs">
                          <div className={`${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{lead.email || 'Email not provided'}</div>
                          {lead.city && <div className={`${isDark ? 'text-gray-500' : 'text-slate-400'} text-[11px]`}>City: {lead.city}</div>}
                        </div>
                      )}
                    </td>

                    {/* Campaign */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        lead.lead_type === 'Instagram DM'
                          ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20'
                          : isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {lead.campaign_name || 'Instagram Video Ad'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {lead.created_at || 'Recently'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border appearance-none cursor-pointer focus:outline-none transition-all ${getStatusBadgeStyle(lead.status)}`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt} className={isDark ? 'bg-[#181824] text-white' : 'bg-white text-slate-900'}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Direct Instagram Chat Action */}
                        {lead.instagram_username && (
                          <a
                            href={getInstagramLink(lead.instagram_username)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 text-pink-400 hover:text-white hover:bg-pink-600 transition-all shadow-sm border border-pink-500/30"
                            title="Reply on Instagram Direct"
                          >
                            <Send className="w-4 h-4" />
                          </a>
                        )}

                        {/* WhatsApp Action */}
                        {lead.phone && (
                          <a
                            href={getWhatsAppLink(lead.phone, lead.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        {/* Direct Call Action */}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-2 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isDark 
                              ? 'text-gray-400 hover:text-rose-400 hover:bg-rose-500/10' 
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title="Delete Lead"
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
  );
}

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Users, Eye, Target, MousePointerClick, CheckCircle2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Mon', leads: 4000, traffic: 2400 },
  { name: 'Tue', leads: 3000, traffic: 1398 },
  { name: 'Wed', leads: 2000, traffic: 9800 },
  { name: 'Thu', leads: 2780, traffic: 3908 },
  { name: 'Fri', leads: 1890, traffic: 4800 },
  { name: 'Sat', leads: 2390, traffic: 3800 },
  { name: 'Sun', leads: 3490, traffic: 4300 },
];

export default function Dashboard() {
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("You must connect your Meta Ads account before creating a new campaign.");
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial connection status
    fetch('/api/meta/status')
      .then(res => res.json())
      .then(data => setIsMetaConnected(data.connected))
      .catch(err => console.error("Failed to check meta status:", err));
  }, []);

  const handleConnectMeta = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/meta/connect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsMetaConnected(true);
      } else { setShowError(true); setErrorMsg(data.message || "Failed to connect to Meta"); }
    } catch (err) { console.error(err); setShowError(true); setErrorMsg(err.message || "Network error"); }
    setIsConnecting(false);
  };

  const handleNewCampaign = () => {
    if (isMetaConnected) {
      navigate('/build');
    } else { setShowError(true); setErrorMsg("You must connect your Meta Ads account before creating a new campaign."); setTimeout(() => setShowError(false), 3000); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back. Here's what's happening with your campaigns.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isMetaConnected ? (
            <div className="flex items-center gap-2 bg-[#1a231f] text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              Meta Connected
            </div>
          ) : (
            <button 
              onClick={handleConnectMeta}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-[#1877F2]/20 shadow-lg disabled:opacity-70"
            >
              
              {isConnecting ? 'Connecting...' : 'Connect Meta Ads'}
            </button>
          )}

          <button 
            onClick={handleNewCampaign}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
              isMetaConnected 
                ? 'bg-[#5c3cbe] hover:bg-[#4a3299] text-white hover:shadow-purple-500/20 shadow-lg' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <Target className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {showError && !isMetaConnected && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: '71,897', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Avg. Traffic', value: '58.16%', change: '+2.02%', icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Avg. CPC', value: '$1.24', change: '-4.05%', icon: MousePointerClick, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Conversions', value: '24.57%', change: '+5.4%', icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-400 font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white nyx-font-heading">{stat.value}</h3>
            </div>
            <stat.icon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Traffic vs Leads Over Time</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c3cbe" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5c3cbe" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#e4e4e7' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#5c3cbe" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

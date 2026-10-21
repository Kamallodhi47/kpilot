import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button } from './ui';
import { Globe, Camera, ShieldCheck, Activity, CheckCircle2, LogOut } from 'lucide-react';
import { MetaConnectModal } from './MetaConnectModal';

export function MetaConnectCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/meta/status', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.connected) {
          setIsConnected(true);
          setAccountName(data.account_name);
          setAdAccounts(data.ad_accounts || []);
          if (data.selected_ad_account_id) {
            setSelectedAdAccount(data.selected_ad_account_id);
          } else if (data.ad_accounts && data.ad_accounts.length > 0) {
            setSelectedAdAccount(data.ad_accounts[0].id);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/meta/connect', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsConnected(true);
        setAccountName(data.account_name);
        setAdAccounts(data.ad_accounts || []);
        if (data.selected_ad_account_id) {
          setSelectedAdAccount(data.selected_ad_account_id);
        }
        return;
      }
      setIsModalOpen(true);
    } catch (err) {
      setIsModalOpen(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectAccount = async (accId: string) => {
    setSelectedAdAccount(accId);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/meta/select-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ad_account_id: accId })
      });
    } catch (e) {
      console.error('Failed to select ad account:', e);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Meta account?")) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/meta/disconnect', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setIsConnected(false);
      setAccountName(null);
      setAdAccounts([]);
      setSelectedAdAccount('');
    } catch (e) {
      console.error('Failed to disconnect Meta:', e);
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-blue-200 shadow-sm shadow-blue-500/10 mb-6 bg-blue-50/50">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-[#1877F2] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Meta Ads Integration</h2>
              <p className="text-slate-600 font-medium">Connect your Meta account to create, manage, and analyze your ad campaigns with AI.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="shrink-0 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2.5 px-6 cursor-pointer"
            >
              {isConnecting ? 'Connecting...' : 'Connect Meta Ads'}
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="shrink-0 text-slate-700 font-semibold py-2.5 px-4 cursor-pointer"
            >
              Manual ID
            </Button>
          </div>
        </CardContent>
        <MetaConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(data) => {
            setIsConnected(true);
            setAccountName(data.account_name);
            setAdAccounts(data.ad_accounts || []);
            if (data.selected_ad_account_id) {
              setSelectedAdAccount(data.selected_ad_account_id);
            }
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="border-green-200 shadow-sm mb-6 bg-white">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Meta Integration ({accountName || 'Connected'})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-bold">Meta Connected</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold border border-rose-200 bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="w-3 h-3" /> Disconnect
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Ad Account
            </label>
            <select
              value={selectedAdAccount}
              onChange={(e) => handleSelectAccount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {adAccounts.length === 0 ? (
                <option value="">No Ad Accounts</option>
              ) : (
                adAccounts.map((acc: any) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name ? `${acc.name} (${acc.id})` : acc.id} {acc.currency ? `[${acc.currency}]` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Globe className="w-4 h-4 mr-1.5" /> Facebook Page
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>My Business Page</option>
              <option>My Secondary Page</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Camera className="w-4 h-4 mr-1.5" /> Instagram
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>@mybrand</option>
              <option>Not Connected</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Activity className="w-4 h-4 mr-1.5" /> Tracking
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>Pixel / Dataset</option>
              <option>Create New Pixel</option>
            </select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

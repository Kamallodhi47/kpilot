import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button, Badge } from './ui';
import { Globe, Camera, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';

export function MetaConnectCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/meta/connect', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setIsConnected(true);
        navigate('/onboarding');
      } else {
        console.error('Failed to connect Meta');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-blue-200 shadow-sm shadow-blue-500/10 mb-6 bg-blue-50/50">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Meta Ads Integration</h2>
              <p className="text-slate-600 font-medium">Connect your Meta account to create, manage, and analyze your ad campaigns with AI.</p>
            </div>
          </div>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6"
          >
            {isConnecting ? 'Connecting...' : 'Connect Meta Ads'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 shadow-sm mb-6 bg-white">
      <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Meta Integration</h2>
        </div>
        <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          <span className="text-sm font-bold">Meta Connected</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Ad Account
            </label>
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>My Business Ad Account</option>
              <option>AdPilot Agency Account</option>
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

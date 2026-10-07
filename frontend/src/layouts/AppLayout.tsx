import { Search, Bell, HelpCircle, Activity, Megaphone, MonitorPlay, BarChart, Zap, SearchCode, Image as ImageIcon, Users, Layers, ShieldCheck, CreditCard, Settings, Plus, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function TopNav() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex-1 max-w-lg flex items-center">
        <h2 className="text-xl font-bold text-slate-800 mr-8 hidden md:block">Dashboard</h2>
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Search campaigns, ads..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-1.5 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-semibold">Meta Connected</span>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200 cursor-pointer">
          R
        </div>
      </div>
    </header>
  );
}

export function Sidebar() {
  const location = useLocation();

  const mainNav = [
    { name: 'Dashboard', icon: Activity, path: '/' },
    { name: 'Create Campaign', icon: Plus, path: '/create-campaign' },
    { name: 'Campaigns', icon: Megaphone, path: '/campaigns' },
    { name: 'Ads & Creatives', icon: MonitorPlay, path: '/creatives' },
    { name: 'Analytics', icon: BarChart, path: '/analytics' },
    { name: 'AI Optimizer', icon: Zap, path: '/optimizer' },
  ];

  const toolsNav = [
    { name: 'Website Analyzer', icon: SearchCode, path: '/analyzer' },
    { name: 'Creative Studio', icon: ImageIcon, path: '/studio' },
    { name: 'Audience Builder', icon: Users, path: '/audience' },
  ];

  const metaNav = [
    { name: 'Meta Accounts', icon: ShieldCheck, path: '/meta' },
  ];

  const accountNav = [
    { name: 'Billing', icon: CreditCard, path: '/billing' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help & Support', icon: HelpCircle, path: '/help' },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-slate-200 flex flex-col h-screen sticky top-0 z-30">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-primary-600">
          <Zap className="h-6 w-6 fill-current" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">AdPilot AI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Main</div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const current = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    current 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${current ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Tools</div>
          <nav className="space-y-1">
            {toolsNav.map((item) => {
              const current = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    current 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${current ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Meta</div>
          <nav className="space-y-1">
            {metaNav.map((item) => {
              const current = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    current 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${current ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Account</div>
          <nav className="space-y-1">
            {accountNav.map((item) => {
              const current = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    current 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${current ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-sm font-bold text-slate-900">Pro Plan</div>
        <div className="mt-2 text-xs text-slate-500 font-medium">68 / 100 campaigns</div>
        <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1.5">
          <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
        </div>
        <button className="mt-3 w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

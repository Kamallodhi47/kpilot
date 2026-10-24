import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Megaphone, Gauge, Lightbulb, Image as ImageIcon, Bot, Box, Menu, ChevronDown, Moon, Sun, Users, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const [isLaunchCampaignOpen, setIsLaunchCampaignOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.is_admin) {
            setIsAdmin(true);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    checkAdmin();
  }, []);

  const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { 
      name: 'Launch Campaign', 
      href: '/build', 
      icon: Megaphone,
      hasChildren: true,
      children: [
        { name: 'Xeno', href: '/build', alias: '/xeno' },
        { name: 'Campulse', href: '/campulse', alias: '/campulse' },
      ]
    },
    { name: 'Dashboard', href: '/dashboard', icon: Gauge },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Optimise', href: '/optimise', icon: Lightbulb },
    { name: 'Pixeo', href: '/pixeo', icon: ImageIcon },
    { name: 'NEO', href: '/neo', icon: Bot },
    { name: 'Assets', href: '/assets', icon: Box },
    // Admin Control navigation item
    ...(isAdmin ? [{ name: 'Admin Control', href: '/admin', icon: ShieldCheck, badge: 'PRO' }] : [
      // If not yet verified or admin, still expose Admin link so the owner can always find it
      { name: 'Admin Control', href: '/admin', icon: ShieldCheck, badge: 'ADMIN' }
    ]),
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#0f0f13] text-white' : 'bg-slate-100 text-slate-900'} font-sans`}>
      
      {/* Sidebar - Hover to expand */}
      <div className={`hidden md:flex flex-col ${isDark ? 'bg-black border-white/5' : 'bg-white border-slate-200 shadow-xl'} border-r transition-all duration-300 z-50 h-screen w-[76px] hover:w-64 group overflow-hidden shrink-0`}>
        
        {/* Logo Section */}
        <div className="flex items-center h-28 px-4 whitespace-nowrap overflow-hidden shrink-0 gap-4 transition-all duration-300 pl-[14px]">
          <div 
            className="kpilot-logo-badge w-12 h-12 rounded-xl flex items-center justify-center relative shadow-lg shadow-purple-500/30 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f97316 100%)',
              backgroundColor: '#a855f7'
            }}
          >
            <span 
              className="font-black text-2xl select-none leading-none" 
              style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                letterSpacing: '-1px', 
                color: '#ffffff !important' 
              }}
            >
              K
            </span>
            <svg 
              className="absolute top-2 right-2 w-2.5 h-2.5" 
              viewBox="0 0 24 24"
              style={{ color: '#ffffff', fill: '#ffffff' }}
            >
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
          <span className={`font-bold text-xl tracking-wider ${isDark ? 'text-white' : 'text-slate-900'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100`}>PILOT</span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-none">
          <nav className="flex-1 space-y-2.5">
            {navigation.map((item) => {
              if (item.hasChildren && item.children) {
                const isParentActive = location.pathname.startsWith('/build') || location.pathname.startsWith('/xeno') || location.pathname.startsWith('/campulse');

                return (
                  <div key={item.name} className="flex flex-col">
                    {/* Parent item */}
                    <div
                      onClick={() => setIsLaunchCampaignOpen(!isLaunchCampaignOpen)}
                      className={`
                        flex items-center justify-between py-3 px-3.5 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer overflow-hidden
                        ${isParentActive 
                          ? 'nav-item-active bg-[#7c3aed] text-white shadow-lg shadow-purple-500/25' 
                          : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'}
                      `}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`flex-shrink-0 h-[22px] w-[22px] transition-transform ${isParentActive ? 'text-white' : isDark ? 'text-gray-300' : 'text-slate-600'}`}
                          strokeWidth={isParentActive ? 2.5 : 2}
                        />
                        <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                          {item.name}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isLaunchCampaignOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Tree Dropdown Children */}
                    {isLaunchCampaignOpen && (
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-6 mt-1.5 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-3 before:w-[1.5px] ${isDark ? 'before:bg-white/20' : 'before:bg-slate-300'}`}>
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href || (child.alias && location.pathname === child.alias);
                          
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="flex items-center relative py-1 text-base group/child whitespace-nowrap pl-3"
                            >
                              <span className={`absolute -left-1 w-3 h-[1.5px] ${isChildActive ? 'bg-[#7c3aed]' : isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
                              
                              <div className={`px-3 py-1.5 rounded-xl text-sm sm:text-base font-semibold transition-all w-full overflow-hidden ${
                                isChildActive 
                                  ? 'nav-item-active bg-[#7c3aed] text-white shadow-md shadow-purple-500/25' 
                                  : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}>
                                {child.name}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = item.href === '/home' ? location.pathname === '/home' : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center py-3 px-3.5 font-semibold rounded-xl transition-all whitespace-nowrap overflow-hidden
                    ${isActive 
                      ? 'nav-item-active bg-[#7c3aed] text-white shadow-lg shadow-purple-500/25' 
                      : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'}
                  `}
                >
                  <item.icon
                    className={`flex-shrink-0 h-[22px] w-[22px] transition-transform ${isActive ? 'text-white' : isDark ? 'text-gray-300' : 'text-slate-600'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 flex items-center gap-2`}>
                    {item.name}
                    {(item as any).badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {(item as any).badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theme Toggle Button in Sidebar Footer */}
        <div className={`p-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200'} shrink-0`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center w-full py-2.5 px-3 rounded-xl transition-all cursor-pointer overflow-hidden ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 shadow-sm'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="flex-shrink-0">
              {isDark ? <Moon className="h-5 w-5 text-purple-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
            </div>
            <span className="ml-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 w-0 overflow-hidden ${isDark ? 'bg-[#0f0f13]' : 'bg-slate-100'} transition-all duration-300`}>
        {/* Mobile Header */}
        <div className={`md:hidden flex items-center justify-between p-4 ${isDark ? 'bg-black border-white/5' : 'bg-white border-slate-200 shadow-sm'} border-b`}>
          <div className="flex items-center gap-2.5">
            <div 
              className="kpilot-logo-badge w-8 h-8 rounded-lg flex items-center justify-center relative shadow-md shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f97316 100%)',
                backgroundColor: '#a855f7'
              }}
            >
              <span 
                className="font-black text-lg select-none leading-none" 
                style={{ 
                  fontFamily: 'Montserrat, sans-serif', 
                  letterSpacing: '-1px',
                  color: '#ffffff !important' 
                }}
              >
                K
              </span>
              <svg 
                className="absolute top-1 right-1 w-2 h-2" 
                viewBox="0 0 24 24"
                style={{ color: '#ffffff', fill: '#ffffff' }}
              >
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
              </svg>
            </div>
            <span className={`font-bold text-lg tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>PILOT</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-200'}`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>
            <button className={`p-2 rounded-md ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'}`}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className={
            location.pathname === "/build" || 
            location.pathname === "/xeno" || 
            location.pathname === "/pixeo" || 
            location.pathname === "/neo" || 
            location.pathname === "/analytics" || 
            location.pathname === "/leads" || 
            location.pathname === "/admin" || 
            location.pathname === "/processing" 
              ? "h-full w-full" 
              : "p-4 sm:p-6 md:p-8 h-full"
          }>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

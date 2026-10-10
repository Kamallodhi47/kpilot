import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Megaphone, Gauge, Lightbulb, Image as ImageIcon, Bot, Box, Menu, ChevronDown } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const [isLaunchCampaignOpen, setIsLaunchCampaignOpen] = useState(true);

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
    { name: 'Optimise', href: '/optimise', icon: Lightbulb },
    { name: 'Pixeo', href: '/pixeo', icon: ImageIcon },
    { name: 'NEO', href: '/neo', icon: Bot },
    { name: 'Assets', href: '/assets', icon: Box },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f13] text-white font-sans">
      
      {/* Sidebar - Hover to expand */}
      <div className="hidden md:flex flex-col bg-black border-r border-white/5 transition-all duration-300 z-50 h-screen w-[76px] hover:w-64 group overflow-hidden shadow-2xl shrink-0">
        
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
          <span className="font-bold text-xl tracking-wider text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">PILOT</span>
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
                        flex items-center justify-between py-3 px-3.5 font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer
                        ${isParentActive 
                          ? 'nav-item-active bg-[#7c3aed] text-white shadow-lg shadow-purple-500/25' 
                          : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}
                      `}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`flex-shrink-0 h-[22px] w-[22px] transition-transform ${isParentActive ? 'text-white' : 'text-slate-600 dark:text-gray-300'}`}
                          strokeWidth={isParentActive ? 2.5 : 2}
                        />
                        <span className="ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                          {item.name}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isLaunchCampaignOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Tree Dropdown Children (Matching screenshot tree connector style) */}
                    {isLaunchCampaignOpen && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-6 mt-1.5 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-3 before:w-[1.5px] before:bg-slate-300 dark:before:bg-white/20">
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href || (child.alias && location.pathname === child.alias);
                          
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="flex items-center relative py-1 text-sm group/child whitespace-nowrap pl-3"
                            >
                              {/* Horizontal connector branch */}
                              <span className={`absolute -left-1 w-3 h-[1.5px] ${isChildActive ? 'bg-[#7c3aed]' : 'bg-slate-300 dark:bg-white/20'}`} />
                              
                              <div className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all w-full ${
                                isChildActive 
                                  ? 'nav-item-active bg-[#7c3aed] text-white shadow-md shadow-purple-500/25' 
                                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
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
                    flex items-center py-3 px-3.5 font-semibold rounded-xl transition-all whitespace-nowrap
                    ${isActive 
                      ? 'nav-item-active bg-[#7c3aed] text-white shadow-lg shadow-purple-500/25' 
                      : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}
                  `}
                >
                  <item.icon
                    className={`flex-shrink-0 h-[22px] w-[22px] transition-transform ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-300'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content (Margin left to accommodate collapsed sidebar) */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-[#0f0f13] transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
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
            <span className="font-bold text-lg tracking-wider text-slate-900 dark:text-white">PILOT</span>
          </div>
          <button className="text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-md">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className={
            location.pathname === "/build" || 
            location.pathname === "/xeno" || 
            location.pathname === "/pixeo" || 
            location.pathname === "/neo" || 
            location.pathname === "/analytics" || 
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

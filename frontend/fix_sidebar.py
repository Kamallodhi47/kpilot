path = 'c:/Users/dell/meta/frontend/src/layouts/MainLayout.tsx'

content = """import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Megaphone, Gauge, Lightbulb, Image as ImageIcon, Bot, Box, Menu } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Launch Campaign', href: '/build', icon: Megaphone },
    { name: 'Dashboard', href: '/dashboard', icon: Gauge },
    { name: 'Optimise', href: '/optimise', icon: Lightbulb },
    { name: 'Pixeo', href: '/pixeo', icon: ImageIcon },
    { name: 'NEO', href: '/neo', icon: Bot },
    { name: 'Assets', href: '/assets', icon: Box },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f13] text-white font-sans">
      
      {/* Sidebar - Hover to expand */}
      <div className="hidden md:flex flex-col bg-black border-r border-white/5 transition-all duration-300 z-50 h-screen fixed left-0 top-0 w-[76px] hover:w-64 group overflow-hidden shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex items-center h-28 px-4 whitespace-nowrap overflow-hidden shrink-0 gap-4 transition-all duration-300 pl-[14px]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 flex items-center justify-center relative shadow-lg shadow-purple-500/20 shrink-0">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'sans-serif', letterSpacing: '-1px' }}>N</span>
            <svg className="absolute top-2 right-2 w-2.5 h-2.5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">NYX</span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-3">
          <nav className="flex-1 space-y-3">
            {navigation.map((item) => {
              const isActive = item.href === '/home' ? location.pathname === '/home' : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center py-3 px-3.5 font-semibold rounded-xl transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20' 
                      : 'text-white hover:bg-white/5'}
                  `}
                >
                  <item.icon
                    className={`flex-shrink-0 h-[22px] w-[22px] transition-transform ${isActive ? 'text-white' : 'text-gray-300'}`}
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
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-[#0f0f13] md:ml-[76px]">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <button className="text-white hover:bg-white/10 p-2 rounded-md">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className={location.pathname === "/build" ? "h-full w-full" : "p-4 sm:p-6 md:p-8 h-full"}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Zap, Settings, Menu, ChevronDown, ChevronRight, Video, FileText, MousePointerClick } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { 
      name: 'New Campaign', 
      icon: Megaphone, 
      children: [
        { name: 'Video Campaign', href: '/build?type=video', icon: Video },
        { name: 'Post Campaign', href: '/build?type=post', icon: FileText },
        { name: 'Traffic Campaign', href: '/build?type=traffic', icon: MousePointerClick }
      ]
    },
    { name: 'AI Engine', href: '/processing', icon: Zap },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col glass border-r border-black/5">
        <div className="flex items-center justify-center h-16 border-b border-black/5">
          <span className="text-xl font-bold text-gradient">AI AdGenius</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                const isActive = location.pathname.startsWith('/build');
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setCampaignMenuOpen(!campaignMenuOpen)}
                      className={`
                        w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'}
                      `}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                      {campaignMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {campaignMenuOpen && (
                      <div className="mt-1 space-y-1 pl-10 pr-2">
                        {item.children.map((subItem) => {
                          const isSubActive = location.pathname + location.search === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`
                                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                                ${isSubActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'}
                              `}
                            >
                              <subItem.icon className={`mr-3 h-4 w-4 ${isSubActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'}
                  `}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between p-4 glass border-b border-black/5">
          <span className="text-xl font-bold text-gradient">AI AdGenius</span>
          <button className="h-12 w-12 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

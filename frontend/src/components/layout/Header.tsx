import React, { useEffect, useState } from 'react';
import { checkBackendHealth } from '../../api/exploration';
import { Compass, Sliders, Layers, FileText, BarChart3, Globe } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkHealth() {
      try {
        const res = await checkBackendHealth();
        if (mounted) {
          setIsOnline(res.status === 'online');
        }
      } catch {
        if (mounted) {
          setIsOnline(false);
        }
      }
    }

    checkHealth();
    const timer = setInterval(checkHealth, 15000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const navItems = [
    { label: 'Overview', path: '/app', aliases: ['/', '/app'], icon: Globe },
    { label: 'Explore', path: '/explore', aliases: ['/explore'], icon: Compass },
    { label: 'Production', path: '/production', aliases: ['/production'], icon: Sliders },
    { label: 'What-If', path: '/what-if', aliases: ['/what-if'], icon: Layers },
    { label: 'Methodology', path: '/methodology', aliases: ['/methodology'], icon: FileText },
    { label: 'Performance', path: '/model-performance', aliases: ['/model-performance', '/performance'], icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Brand & Project Identity - Strata / Geological Layer Motif */}
        <button
          type="button"
          aria-label="MINERVA Homepage"
          className="flex cursor-pointer items-center space-x-3 group text-left focus-visible:outline-2 focus-visible:outline-[#c26d3a] rounded-lg transition"
          onClick={() => navigate('/')}
        >
          {/* Custom Geological Strata Mark */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 text-[#c26d3a] transition shadow-xs group-hover:border-[#c26d3a]/60 group-hover:shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 12 12 17 22 12" />
              <polyline points="2 17 12 22 22 17" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-[#c26d3a] transition-colors">
                MINERVA
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100">
                MOIL PS 26009
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Manganese exploration & production intelligence
            </p>
          </div>
        </button>

        {/* Navigation Tabs - Understated Enterprise Scientific Nav */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.aliases ? item.aliases.includes(currentPath) : currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center space-x-2 px-3.5 py-2 min-h-[40px] text-sm font-medium transition-all cursor-pointer rounded-md ${
                  active
                    ? 'text-[#c26d3a] font-semibold bg-orange-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${active ? 'text-[#c26d3a]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#c26d3a] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Telemetry & Model Status */}
        <div className="flex items-center space-x-3 text-xs">
          <div
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 text-xs shadow-xs"
            title={isOnline ? 'All XGBoost inference services operational' : 'Attempting to establish connection to model backend'}
          >
            <span className="relative flex h-2 w-2">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </span>
            <span className="text-slate-700 font-medium tracking-tight">
              {isOnline ? 'Inference engine active' : 'Connecting backend...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LandingHeaderProps {
  navigate: (path: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ navigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.5 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(13,27,46,0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
        transition: 'all 0.35s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #C8590A, #F59E0B)' }}
          >
            M
          </div>
          <div>
            <div
              className="font-extrabold text-[17px] tracking-tight leading-none transition-colors"
              style={{ color: '#0D1B2E' }}
            >
              MINERVA
            </div>
            <div className="font-mono text-[8px] tracking-[0.2em] uppercase text-slate-400">
              MOIL · PS 26009
            </div>
          </div>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Technology',   href: '#technology' },
            { label: 'Explore',      href: '/explore' },
            { label: 'Production',   href: '/production' },
            { label: 'What-if',      href: '/what-if' },
            { label: 'Methodology',  href: '/methodology' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.href.startsWith('#')) {
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate(item.href);
                }
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <motion.button
          onClick={() => navigate('/explore')}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-lg cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #C8590A 0%, #D97706 100%)',
            boxShadow: '0 4px 16px rgba(200,89,10,0.28)',
          }}
        >
          Enter application →
        </motion.button>
      </div>
    </motion.header>
  );
};

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  navigate: (path: string) => void;
}

// Light dot grid
const DotGrid: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
    <defs>
      <pattern id="heroDots" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.9" fill="#94A3B8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#heroDots)" opacity="0.35" />
  </svg>
);

// Scan line over image (subtle on light bg)
const ScanLine: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
    <div
      className="absolute left-0 right-0 h-[2px]"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(200,89,10,0.55), rgba(245,158,11,0.7), rgba(200,89,10,0.55), transparent)',
        animation: 'scanDown 5.5s ease-in-out infinite',
      }}
    />
  </div>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
  const badgeRef  = useRef<HTMLDivElement>(null);
  const titleRef  = useRef<HTMLDivElement>(null);
  const descRef   = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const imgRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = [badgeRef, titleRef, descRef, ctaRef, statsRef, imgRef];
    if (prefersReduced) {
      targets.forEach(r => { if (r.current) r.current.style.opacity = '1'; });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    gsap.set(targets.map(r => r.current), { opacity: 0 });
    gsap.set(imgRef.current, { scale: 1.05, y: 16 });
    gsap.set(titleRef.current, { y: 36 });
    gsap.set(descRef.current, { y: 22 });
    gsap.set(ctaRef.current, { y: 16 });

    tl.to(imgRef.current,   { opacity: 1, scale: 1, y: 0, duration: 1.4 }, 0.2)
      .to(badgeRef.current, { opacity: 1, duration: 0.7 }, 0.6)
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.95 }, 0.95)
      .to(descRef.current,  { opacity: 1, y: 0, duration: 0.8 }, 1.4)
      .to(ctaRef.current,   { opacity: 1, y: 0, duration: 0.7 }, 1.75)
      .to(statsRef.current, { opacity: 1, duration: 0.6 }, 2.1);

    return () => { tl.kill(); };
  }, []);

  const stats = [
    { label: 'Accuracy', value: '88.1%', sub: 'Test set' },
    { label: 'F1 Score',  value: '0.86',  sub: 'Prospective' },
    { label: 'Features',  value: '20+',   sub: 'Top predictors' },
    { label: 'Samples',   value: '30K+',  sub: 'Training data' },
  ];

  return (
    <>
      <style>{`
        @keyframes scanDown {
          0%   { top: -2px; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <section
        className="relative min-h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EDF4FB 45%, #FAF6F2 100%)',
        }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none">
          <DotGrid />
        </div>

        {/* Warm radial — right side warm tint */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 80% 40%, rgba(200,89,10,0.07) 0%, transparent 65%)',
          }}
        />

        {/* Cool radial — left side */}
        <div
          className="absolute left-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 20% 30%, rgba(8,145,178,0.05) 0%, transparent 65%)',
          }}
        />

        {/* ── Two-column layout ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] gap-10 lg:gap-16 items-center w-full">

            {/* ─── LEFT: Text ─── */}
            <div className="flex flex-col">

              {/* Badge */}
              <div ref={badgeRef} className="mb-7">
                <span
                  className="inline-flex items-center gap-2.5 text-[11px] font-mono font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-2xs"
                  style={{
                    border: '1.5px solid rgba(184,78,6,0.45)',
                    background: 'rgba(200,89,10,0.1)',
                    color: '#B84E06',
                    fontWeight: 700,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: '#B84E06', animation: 'pulse 2s infinite' }}
                  />
                  MOIL · SIH 2026 · PS 26009
                </span>
              </div>

              {/* Main title */}
              <div ref={titleRef} className="mb-6">
                <h1
                  className="font-extrabold leading-[1.03] tracking-tight"
                  style={{ fontSize: 'clamp(40px, 4.8vw, 72px)', color: '#0D1B2E' }}
                >
                  From
                </h1>
                <h1
                  className="font-extrabold leading-[1.03] tracking-tight"
                  style={{ fontSize: 'clamp(40px, 4.8vw, 72px)', color: '#0D1B2E' }}
                >
                  Space
                  <span style={{ color: '#C8590A' }}>.</span>
                </h1>
                <h1
                  className="font-extrabold leading-[1.03] tracking-tight"
                  style={{
                    fontSize: 'clamp(40px, 4.8vw, 72px)',
                    background: 'linear-gradient(115deg, #C8590A 0%, #F59E0B 60%, #C8590A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  To the Mine.
                </h1>
              </div>

              {/* Description */}
              <div ref={descRef} className="mb-9 max-w-[440px]">
                <p className="text-[15px] text-slate-500 leading-relaxed">
                  AI-powered manganese mineral exploration using Sentinel-2 Earth observation data —
                  from satellite imagery to prospectivity maps to production decision support.
                  Built for MOIL's operations.
                </p>
              </div>

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-wrap items-center gap-3 mb-10">
                <motion.button
                  onClick={() => navigate('/explore')}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 font-bold text-sm px-8 py-4 rounded-xl transition-all cursor-pointer text-white"
                  style={{
                    background: 'linear-gradient(135deg, #C8590A 0%, #D97706 100%)',
                    boxShadow: '0 8px 28px rgba(200,89,10,0.30)',
                  }}
                >
                  Explore MINERVA →
                </motion.button>

                <motion.button
                  onClick={() => document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.02, borderColor: '#CBD5E1' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 font-semibold text-sm px-6 py-4 rounded-xl cursor-pointer transition-all text-slate-600 hover:text-slate-900"
                  style={{ border: '1.5px solid #E2E8F0', backgroundColor: 'white' }}
                >
                  How it works ↓
                </motion.button>
              </div>

              {/* Real model stats */}
              <div ref={statsRef} className="grid grid-cols-4 gap-2.5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3 text-center bg-white"
                    style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
                  >
                    <div className="text-xl font-extrabold mb-0.5" style={{ color: '#0D1B2E' }}>{s.value}</div>
                    <div className="font-mono text-[8px] uppercase tracking-widest text-slate-400">{s.label}</div>
                    <div className="font-mono text-[8px]" style={{ color: '#C8590A' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── RIGHT: Earth image card ─── */}
            <div ref={imgRef} className="relative">

              {/* Main image frame */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: '0 24px 80px rgba(13,27,46,0.14), 0 4px 20px rgba(13,27,46,0.08)',
                  border: '1px solid rgba(13,27,46,0.08)',
                  aspectRatio: '1 / 1',
                }}
              >
                <img
                  src="/earth_india.jpg"
                  alt="Indian subcontinent viewed from space — Earth observation context for MINERVA"
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Subtle dark vignette at edges only */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(13,27,46,0.4) 100%)',
                  }}
                />

                {/* Scan line */}
                <ScanLine />

                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 rounded-tl" style={{ borderColor: 'rgba(200,89,10,0.7)' }} />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 rounded-tr" style={{ borderColor: 'rgba(200,89,10,0.7)' }} />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 rounded-bl" style={{ borderColor: 'rgba(200,89,10,0.7)' }} />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 rounded-br" style={{ borderColor: 'rgba(200,89,10,0.7)' }} />

                {/* Top-right annotation chips */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: 'rgba(13,27,46,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(200,89,10,0.3)' }}
                  >
                    <div className="font-mono text-[8px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(200,89,10,0.8)' }}>Earth observation</div>
                    <div className="font-mono text-[10px] font-medium text-white">India · From orbit</div>
                  </div>
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: 'rgba(13,27,46,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(8,145,178,0.3)' }}
                  >
                    <div className="font-mono text-[8px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(8,145,178,0.8)' }}>Sensor</div>
                    <div className="font-mono text-[10px] font-medium text-white">Sentinel-2 MSI</div>
                  </div>
                </div>

                {/* Bottom caption */}
                <div className="absolute bottom-3 left-4">
                  <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Artistic representation · Not a MINERVA output
                  </p>
                </div>
              </div>

              {/* Floating metric cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 2.3 }}
                className="absolute -right-5 top-1/3 hidden xl:block"
              >
                <div className="rounded-2xl bg-white p-4 text-left w-44" style={{ border: '1px solid #E2E8F0', boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}>
                  <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-1">Model accuracy</div>
                  <div className="text-2xl font-extrabold" style={{ color: '#0D1B2E' }}>88.1<span className="text-sm font-semibold text-slate-400">%</span></div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Test set F1: 0.86</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 2.5 }}
                className="absolute -left-5 bottom-1/4 hidden xl:block"
              >
                <div className="rounded-2xl bg-white p-4 text-left w-44" style={{ border: '1px solid #E2E8F0', boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}>
                  <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-1">Top signal</div>
                  <div className="text-sm font-extrabold leading-tight" style={{ color: '#0D1B2E' }}>Resistivity</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ohm·m · SHAP gain #1</div>
                </div>
              </motion.div>

              {/* Capability pills below image */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Sentinel-2', 'XGBoost', 'SHAP', 'Iron Oxide Index', 'SWIR'].map((label) => (
                  <span
                    key={label}
                    className="text-[11px] font-medium text-slate-500 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          <div className="w-px h-10 rounded-full mx-auto" style={{ background: 'linear-gradient(to bottom, rgba(200,89,10,0.4), transparent)' }} />
        </motion.div>
      </section>
    </>
  );
};

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FinalCTASectionProps { navigate: (path: string) => void; }

const C = { copper: '#C8590A', amber: '#F59E0B', teal: '#0891B2', emerald: '#065F46', navy: '#0D1B2E' };

const modules = [
  { label: 'Mineral exploration',  desc: 'Prospectivity analysis for any Indian location',       path: '/explore',           accent: C.teal,    icon: '🛰️' },
  { label: 'Production planning',  desc: 'Target feasibility vs. operating conditions',           path: '/production',        accent: C.copper,  icon: '⛏️' },
  { label: 'Scenario analysis',    desc: 'Compare model estimates across operational scenarios',  path: '/what-if',           accent: '#9333EA', icon: '🔬' },
  { label: 'Methodology',          desc: 'Data pipeline and model design documentation',         path: '/methodology',       accent: C.emerald, icon: '📐' },
  { label: 'Model performance',    desc: 'Empirical validation and benchmark metrics',            path: '/model-performance', accent: '#DC2626', icon: '📊' },
];

// Real stats shown in footer CTA
const highlights = [
  { value: '88.1%', label: 'Model accuracy',   sub: 'on test set' },
  { value: '0.86',  label: 'F1 Score',          sub: 'prospective class' },
  { value: 'SHAP',  label: 'Explainability',    sub: 'feature attribution' },
  { value: 'MOIL',  label: 'Partner',            sub: 'manganese operations' },
];

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ navigate }) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg, #F8FAFC 0%, #EDF4FB 50%, #FAF6F2 100%)' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" aria-hidden="true">
          <defs>
            <pattern id="footerDots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" fill="#94A3B8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerDots)" opacity="0.3" />
        </svg>
      </div>

      {/* Warm radial glow */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '500px',
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(200,89,10,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Top section divider line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, rgba(200,89,10,0.35), rgba(245,158,11,0.5), rgba(200,89,10,0.35), transparent)` }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-2 font-mono font-bold text-[11px] tracking-[0.25em] uppercase px-4 py-2 rounded-full shadow-2xs"
            style={{
              border: '1.5px solid rgba(184,78,6,0.4)',
              backgroundColor: 'rgba(200,89,10,0.09)',
              color: '#B84E06',
              fontWeight: 700,
            }}
          >
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#B84E06', animation: 'pulse 2s infinite' }} />
            MOIL · SIH 2026 · Problem Statement 26009
          </span>
        </motion.div>

        {/* Statement */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h2 className="font-extrabold leading-[1.08] tracking-tight mb-2" style={{ fontSize: 'clamp(34px, 4.5vw, 58px)', color: C.navy }}>
            From Earth observation
          </h2>
          <h2
            className="font-extrabold leading-[1.08] tracking-tight"
            style={{
              fontSize: 'clamp(34px, 4.5vw, 58px)',
              background: `linear-gradient(115deg, ${C.copper} 0%, ${C.amber} 55%, ${C.copper} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            to operational decision.
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-slate-500 text-[15px] leading-relaxed max-w-lg mx-auto mb-10"
        >
          MINERVA bridges satellite remote sensing, geospatial AI, and mine planning
          into a single decision-support platform for MOIL's manganese operations.
        </motion.p>

        {/* Brand lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
            style={{
              background: `linear-gradient(135deg, ${C.copper}, ${C.amber})`,
              boxShadow: `0 8px 28px rgba(200,89,10,0.30)`,
            }}
          >
            M
          </div>
          <div className="text-left">
            <div className="text-4xl font-black tracking-tight leading-none" style={{ color: C.navy }}>MINERVA</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Manganese Exploration & Production Intelligence</div>
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <motion.button
            onClick={() => navigate('/explore')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 font-bold text-base text-white px-12 py-4 rounded-xl cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${C.copper} 0%, ${C.amber} 100%)`,
              boxShadow: `0 10px 36px rgba(200,89,10,0.30)`,
            }}
          >
            Enter MINERVA
            <span className="text-lg">→</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/methodology')}
            whileHover={{ scale: 1.02, borderColor: '#CBD5E1' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl cursor-pointer transition-all text-slate-600 hover:text-slate-900"
            style={{ border: '1.5px solid #E2E8F0', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            Read the methodology
          </motion.button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14 max-w-2xl mx-auto"
        >
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl p-4 bg-white text-center"
              style={{ border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <div className="text-2xl font-extrabold mb-0.5" style={{ color: C.navy }}>{h.value}</div>
              <div className="text-xs font-semibold text-slate-600">{h.label}</div>
              <div className="font-mono text-[9px] text-slate-400 mt-0.5">{h.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Module grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="border-t mb-8" style={{ borderColor: '#E2E8F0' }} />
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] mb-6 text-slate-400">
            Application modules
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
            {modules.map((mod, idx) => (
              <motion.button
                key={mod.label}
                onClick={() => navigate(mod.path)}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 1.0 + idx * 0.07 }}
                whileHover={{ y: -3, boxShadow: `0 8px 24px rgba(0,0,0,0.10)`, borderColor: `${mod.accent}40` }}
                className="rounded-xl p-4 text-left cursor-pointer transition-all bg-white"
                style={{ border: '1.5px solid #E8EDF3', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{mod.icon}</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mod.accent }} />
                </div>
                <div className="text-sm font-bold mb-1" style={{ color: C.navy }}>{mod.label}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{mod.desc}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
          style={{ borderColor: '#E2E8F0' }}
        >
          <div>
            <span className="font-mono text-[9px] text-slate-400 block">
              Built for Smart India Hackathon 2026 · MOIL Problem Statement 26009
            </span>
            <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
              Manganese Ore India Limited · Mineral Exploration & Production Decision Support
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-slate-300">XGBoost · SHAP · Sentinel-2 · SRTM</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

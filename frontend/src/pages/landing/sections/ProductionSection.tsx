import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ProductionSectionProps { navigate: (path: string) => void; }

const C = { copper: '#C8590A', amber: '#F59E0B', teal: '#0891B2', emerald: '#065F46', navy: '#0D1B2E' };

const flow = [
  { icon: '◎', label: 'Production target',    desc: 'Monthly tonnage goal set by planners',            color: C.emerald },
  { icon: '⊕', label: 'Operating conditions', desc: 'Equipment, blasts, weather, manpower',            color: C.teal },
  { icon: '◈', label: 'Model inference',       desc: 'XGBoost regressor + classifier',                 color: '#9333EA' },
  { icon: '◆', label: 'Risk classification',   desc: 'Shortfall probability and risk level',            color: '#DC2626' },
  { icon: '◉', label: 'Decision support',      desc: 'Recommended actions and SHAP explanations',       color: C.emerald },
];

const levers = [
  { label: 'Equipment downtime',    impact: -1 }, { label: 'Operating fleet size',  impact: +1 },
  { label: 'Blast completion rate', impact: +1 }, { label: 'Transport delay',       impact: -1 },
  { label: 'Rainfall',              impact: -1 }, { label: 'Ore grade',             impact: +1 },
  { label: 'Manpower available',    impact: +1 }, { label: 'Power outage hours',    impact: -1 },
];

export const ProductionSection: React.FC<ProductionSectionProps> = ({ navigate }) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF4FB 100%)' }}>
      <div className="absolute top-8 right-6 select-none pointer-events-none">
        <span className="font-extrabold" style={{ fontSize: '140px', lineHeight: 1, color: 'rgba(13,27,46,0.04)' }}>04</span>
      </div>

      <div className="mx-auto max-w-6xl space-y-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75 }} className="max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${C.emerald}, #059669)` }}>04</div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.emerald }}>Plan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4" style={{ color: C.navy }}>
            Exploration is
            <br />only the beginning
          </h2>
          <p className="text-slate-500 text-[15px] leading-relaxed">
            MINERVA extends beyond prospectivity into operational mine planning — evaluating whether
            monthly production targets are achievable under current site conditions.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Flow */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.1 }}>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: C.navy }}>Can the target be met?</h3>
            <p className="text-sm text-slate-400 mb-6">Structural overview — no production values shown.</p>
            <div className="space-y-2">
              {flow.map((step, idx) => (
                <React.Fragment key={step.label}>
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4 shadow-xs"
                    style={{ borderColor: `${step.color}20` }}
                  >
                    <span className="text-xl shrink-0" style={{ color: step.color }}>{step.icon}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: C.navy }}>{step.label}</div>
                      <div className="text-xs text-slate-400">{step.desc}</div>
                    </div>
                  </motion.div>
                  {idx < flow.length - 1 && (
                    <div className="flex justify-center"><div className="w-px h-3 bg-slate-200" /></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <motion.button
              onClick={() => navigate('/production')}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold cursor-pointer"
              style={{ color: C.copper }}
            >
              Open production planner →
            </motion.button>
          </motion.div>

          {/* Levers */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.25 }}>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: C.navy }}>Understand the constraints</h3>
            <p className="text-sm text-slate-400 mb-6">Operational factors tracked by the model — directional only.</p>
            <div className="rounded-2xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: '#E2E8F0' }}>
              {levers.map((lever, idx) => (
                <motion.div
                  key={lever.label}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.35 + idx * 0.06 }}
                  className="flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0"
                  style={{ borderColor: '#F1F5F9' }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lever.impact > 0 ? C.emerald : '#DC2626' }} />
                  <span className="flex-1 text-sm font-medium" style={{ color: C.navy }}>{lever.label}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      color: lever.impact > 0 ? C.emerald : '#DC2626',
                      backgroundColor: lever.impact > 0 ? '#ECFDF5' : '#FEF2F2',
                    }}
                  >
                    {lever.impact > 0 ? '↑ output' : '↓ output'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* What-if block - light warm theme */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.5 }}
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 50%, #FEF9F5 100%)', border: '1.5px solid rgba(200,89,10,0.18)' }}
        >
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg className="w-full h-full" aria-hidden="true"><defs><pattern id="whatifDots2" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#C8590A" opacity="0.3" /></pattern></defs><rect width="100%" height="100%" fill="url(#whatifDots2)" /></svg>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #C8590A, #F59E0B)' }} />
          <div className="relative z-10 p-8 md:p-10 pl-10 md:pl-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #C8590A, #F59E0B)' }}>05</div>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.copper }}>Act</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2" style={{ color: C.navy }}>What changes the outcome?</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Scenario analysis lets you modify a single operational lever and see immediately how the model estimates the impact on expected production vs. baseline. Adjust a lever — the model re-evaluates.
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/what-if')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C8590A, #D97706)', boxShadow: '0 8px 28px rgba(200,89,10,0.28)' }}
            >
              Run a scenario →
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>

  );
};

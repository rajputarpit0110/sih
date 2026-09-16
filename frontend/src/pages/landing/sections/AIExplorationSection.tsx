import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AIExplorationSectionProps {
  navigate: (path: string) => void;
}

const C = { copper: '#C8590A', amber: '#F59E0B', teal: '#0891B2', emerald: '#065F46', navy: '#0D1B2E' };

const ProspectivityGrid: React.FC = () => {
  const cols = 14, rows = 9;
  const getIntensity = (c: number, r: number) => {
    const v1 = Math.max(0, 1 - Math.sqrt((c - 9) ** 2 + (r - 2.5) ** 2) / 5.5) * 0.95;
    const v2 = Math.max(0, 1 - Math.sqrt((c - 3.5) ** 2 + (r - 6.5) ** 2) / 3.8) * 0.75;
    return Math.min(1, v1 + v2);
  };
  const getStyle = (v: number) => {
    if (v < 0.2)  return { bg: '#EFF6FF', border: '#BFDBFE' };
    if (v < 0.42) return { bg: '#D1FAE5', border: '#6EE7B7' };
    if (v < 0.65) return { bg: '#FEF3C7', border: '#FDE68A' };
    if (v < 0.82) return { bg: '#FFEDD5', border: '#FDBA74' };
    return { bg: '#C8590A', border: '#9A3C06' };
  };
  const cells = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({ r, c, v: getIntensity(c, r) }))
  ).flat();

  return (
    <div className="rounded-2xl border overflow-hidden bg-white shadow-sm" style={{ borderColor: '#E2E8F0' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9', backgroundColor: '#FAFBFC' }}>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Prospectivity surface
        </span>
        <span className="font-mono text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ color: C.teal, border: `1px solid ${C.teal}30`, backgroundColor: `${C.teal}08` }}>
          Conceptual only
        </span>
      </div>
      <div className="p-3" style={{ backgroundColor: '#FAFBFC' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2px' }}>
          {cells.map((cell, idx) => {
            const { bg, border } = getStyle(cell.v);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: idx * 0.002 }}
                className="rounded-sm"
                style={{ height: '26px', backgroundColor: bg, border: `1px solid ${border}` }}
              />
            );
          })}
        </div>
      </div>
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        {[
          { l: 'Low', bg: '#EFF6FF', border: '#BFDBFE' },
          { l: 'Moderate', bg: '#D1FAE5', border: '#6EE7B7' },
          { l: 'Elevated', bg: '#FEF3C7', border: '#FDE68A' },
          { l: 'High', bg: '#FFEDD5', border: '#FDBA74' },
          { l: 'Very high', bg: '#C8590A', border: '#9A3C06' },
        ].map((item) => (
          <div key={item.l} className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-sm border" style={{ backgroundColor: item.bg, borderColor: item.border }} />
            <span className="font-mono text-[8px] text-slate-400">{item.l}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <p className="font-mono text-[9px] text-slate-400">Abstract pattern only — use the application to analyse real locations.</p>
      </div>
    </div>
  );
};

export const AIExplorationSection: React.FC<AIExplorationSectionProps> = ({ navigate }) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden" style={{ background: '#ffffff' }}>
      <div className="absolute top-8 right-6 select-none pointer-events-none">
        <span className="font-extrabold" style={{ fontSize: '140px', lineHeight: 1, color: '#F1F5F9' }}>03</span>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${C.copper}, ${C.amber})` }}>03</div>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.copper }}>Predict</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5" style={{ color: C.navy }}>
                Find where
                <br />
                <span style={{ color: C.copper }}>the signal is strongest</span>
              </h2>

              <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
                An XGBoost classifier trained on labelled geological survey data learns to recognise
                spatial patterns associated with known manganese mineralisation. Output is a
                prospectivity estimate — not a mineral content measurement.
              </p>

              <div className="space-y-1 mb-7">
                {[
                  { n: '01', label: 'Feature vector assembled',   desc: 'Spectral, terrain, geological inputs combined', color: '#3B82F6' },
                  { n: '02', label: 'XGBoost classifier applied', desc: 'Trained on MOIL survey data',                  color: '#9333EA' },
                  { n: '03', label: 'Prospectivity probability',  desc: 'Pattern-match likelihood at that location',     color: C.copper },
                  { n: '04', label: 'SHAP feature attribution',   desc: 'Which signals drove the estimate',              color: C.teal },
                ].map((item) => (
                  <div
                    key={item.n}
                    className="flex items-start gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-colors cursor-default"
                  >
                    <div
                      className="w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.n}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: C.navy }}>{item.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Amber caveat box */}
              <div className="rounded-xl p-4 border" style={{ borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
                    <strong>Important:</strong> Prospectivity identifies pattern matches with known mineralisation — not
                    a measurement of mineral content. Field validation, sampling, and drilling are essential
                    before drawing conclusions about actual mineral resources.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={() => navigate('/explore')}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold cursor-pointer transition-colors"
              style={{ color: C.copper }}
            >
              Analyse a location in the application →
            </motion.button>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-6 space-y-4"
          >
            <ProspectivityGrid />

            {/* Real feature importance chart */}
            <div className="rounded-2xl border overflow-hidden bg-white shadow-sm" style={{ borderColor: '#E2E8F0' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9', backgroundColor: '#FAFBFC' }}>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Top 20 feature importances (XGBoost gain)
                </span>
                <span className="font-mono text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ color: C.emerald, border: `1px solid ${C.emerald}30`, backgroundColor: '#ECFDF5' }}>
                  ✓ Real model output
                </span>
              </div>
              <img src="/feature_importance.png" alt="Top 20 features — Manganese Prospectivity Model" className="w-full" draggable={false} />
              <div className="px-4 pb-3 pt-2">
                <p className="font-mono text-[9px] text-slate-400">Source: Trained XGBoost classifier · Resistivity and gravity anomaly dominate importance scores.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

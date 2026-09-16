import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const C = { copper: '#C8590A', amber: '#F59E0B', teal: '#0891B2', emerald: '#065F46', navy: '#0D1B2E' };

const pipeline = [
  { id: '01', label: 'Satellite imagery',    sub: 'Spectral bands B2–B12 (Sentinel-2)',              color: '#3B82F6', bg: '#EFF6FF' },
  { id: '02', label: 'Derived indices',       sub: 'Iron oxide · NDVI · SWIR ratio · NDMI',           color: '#0891B2', bg: '#ECFEFF' },
  { id: '03', label: 'Terrain features',      sub: 'Elevation · Slope · Curvature (SRTM DEM)',        color: '#B45309', bg: '#FFFBEB' },
  { id: '04', label: 'Geological context',    sub: 'Lithology class · Lineament density',             color: '#065F46', bg: '#ECFDF5' },
  { id: '05', label: 'Feature vector',        sub: 'Structured model input',                          color: '#C8590A', bg: '#FFF7ED' },
  { id: '06', label: 'XGBoost classifier',    sub: 'Trained on MOIL-labelled survey samples',         color: '#9333EA', bg: '#FAF5FF', badge: 'AI model' },
  { id: '07', label: 'Prospectivity output',  sub: 'Spatial probability + confidence estimate',       color: '#DC2626', bg: '#FEF2F2', badge: 'Final output' },
];

export const SignalsSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F0F5FB 100%)' }}
    >
      {/* Watermark */}
      <div className="absolute top-8 right-6 select-none pointer-events-none">
        <span className="font-extrabold" style={{ fontSize: '140px', lineHeight: 1, color: 'rgba(13,27,46,0.04)' }}>02</span>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          className="mb-16 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${C.copper}, ${C.amber})` }}>02</div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.copper }}>Interpret</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4" style={{ color: C.navy }}>
            From raw pixels
            <br />
            <span className="text-slate-400 font-semibold">to model-ready signals</span>
          </h2>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-lg">
            Only step 6 is AI — everything before is deterministic signal processing and
            classical feature engineering.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="relative">
          {/* Connector */}
          <div
            className="absolute left-[1.35rem] top-4 bottom-4 w-0.5 hidden md:block rounded-full"
            style={{ background: 'linear-gradient(180deg, #3B82F6, #C8590A 50%, #DC2626)' }}
          />

          <div className="space-y-3">
            {pipeline.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4"
              >
                {/* Node circle */}
                <div
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-[11px] font-bold border-2 bg-white"
                  style={{ borderColor: step.color, color: step.color }}
                >
                  {step.id}
                </div>

                {/* Card */}
                <div
                  className="flex-1 flex items-center justify-between gap-4 rounded-xl px-5 py-3.5 border"
                  style={{ backgroundColor: step.bg, borderColor: `${step.color}25` }}
                >
                  <div>
                    <span className="text-sm font-bold" style={{ color: C.navy }}>{step.label}</span>
                    <span className="text-xs text-slate-500 ml-2 hidden sm:inline">{step.sub}</span>
                  </div>
                  {step.badge && (
                    <span
                      className="shrink-0 text-[9px] font-bold px-3 py-1 rounded-full border"
                      style={{ borderColor: `${step.color}50`, color: step.color, backgroundColor: 'white' }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 ml-14 font-mono text-[10px] text-slate-400 leading-relaxed max-w-md"
          >
            Pipeline schematic — exact feature definitions are in the project methodology documentation.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

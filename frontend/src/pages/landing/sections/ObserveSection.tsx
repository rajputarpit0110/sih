import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Color tokens ────────────────────────────────────────────
const C = {
  copper: '#C8590A',
  amber:  '#F59E0B',
  teal:   '#0891B2',
  emerald:'#065F46',
  navy:   '#0D1B2E',
  white:  '#FFFFFF',
};

const SpectralBands: React.FC = () => {
  const bands = [
    { id: 'B2',  name: 'Blue',      color: '#3B82F6', wavelength: '490 nm', use: 'Coastal aerosol' },
    { id: 'B3',  name: 'Green',     color: '#10B981', wavelength: '560 nm', use: 'Vegetation' },
    { id: 'B4',  name: 'Red',       color: '#EF4444', wavelength: '665 nm', use: 'Chlorophyll' },
    { id: 'B5',  name: 'Red Edge',  color: '#F97316', wavelength: '705 nm', use: 'Vegetation edge' },
    { id: 'B6',  name: 'Red Edge',  color: '#EA580C', wavelength: '740 nm', use: 'Canopy stress' },
    { id: 'B7',  name: 'NIR',       color: '#B45309', wavelength: '783 nm', use: 'Biomass' },
    { id: 'B8',  name: 'NIR broad', color: '#92400E', wavelength: '842 nm', use: 'Structural' },
    { id: 'B11', name: 'SWIR 1',    color: '#7C2D12', wavelength: '1610 nm',use: 'Mineral / soil' },
    { id: 'B12', name: 'SWIR 2',    color: '#6B1E0C', wavelength: '2190 nm',use: 'Iron oxide signal' },
  ];

  return (
    <div className="space-y-1.5">
      {bands.map((band, idx) => (
        <motion.div
          key={band.id}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.45, delay: idx * 0.055, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left', display: 'grid', gridTemplateColumns: '2rem 1fr 5rem', alignItems: 'center', gap: '0.5rem' }}
        >
          <span className="font-mono text-[10px] text-slate-400 font-medium">{band.id}</span>
          <div className="relative h-6 rounded overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
            <div
              className="absolute inset-y-0 left-0 rounded flex items-center px-2"
              style={{ width: `${55 + idx * 4.5}%`, backgroundColor: band.color }}
            >
              <span className="text-[9px] font-medium text-white/90 truncate">{band.use}</span>
            </div>
          </div>
          <span className="font-mono text-[9px] text-slate-400 text-right">{band.wavelength}</span>
        </motion.div>
      ))}
    </div>
  );
};

export const ObserveSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="technology"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Large watermark number */}
      <div className="absolute top-8 right-6 select-none pointer-events-none">
        <span className="font-extrabold" style={{ fontSize: '140px', lineHeight: 1, color: '#F1F5F9' }}>01</span>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${C.teal}, #0E7490)` }}>01</div>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.teal }}>Observe</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5" style={{ color: C.navy }}>
              Reading the
              <br />
              <span style={{ color: C.emerald }}>Earth's surface</span>
            </h2>

            <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-md">
              Sentinel-2 multispectral imagery provides 13 spectral bands from visible to shortwave
              infrared. Distinctive mineral signatures, particularly iron oxide, are detectable in
              SWIR bands — forming the spatial signals used by the exploration model.
            </p>

            <div className="space-y-2.5 mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key derived signals</p>
              {[
                { label: 'Iron oxide index',      sub: 'B11/B4 ratio — correlated with ferruginous surfaces', color: C.copper },
                { label: 'SWIR mineral index',    sub: 'Shortwave reflectance pattern over rock outcrops', color: C.teal },
                { label: 'Lineament density',     sub: 'Structural geology — fault and fracture density', color: C.emerald },
                { label: 'Vegetation anomaly',    sub: 'NDVI suppression over mineralised zones', color: '#7C3AED' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-3.5 rounded-xl border"
                  style={{ borderColor: `${item.color}20`, backgroundColor: `${item.color}06` }}
                >
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: C.navy }}>{item.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
                  </div>
                </div>
              ))}
              <p className="font-mono text-[10px] text-slate-400 italic pt-1">
                Model input features — not direct mineral measurements.
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-6 space-y-4"
          >
            {/* SWIR image */}
            <div className="rounded-2xl overflow-hidden shadow-xl relative">
              <img
                src="/swir_geology.jpg"
                alt="Sentinel-2 SWIR false-colour composite — iron-rich geological formations"
                className="w-full object-cover"
                style={{ height: '220px' }}
                draggable={false}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,46,0.7), transparent)' }} />
              <div className="absolute bottom-3 left-4">
                <div className="font-mono text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Sentinel-2 · SWIR false-colour (B12-B11-B4)
                </div>
                <div className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Iron-rich geology · Illustrative image
                </div>
              </div>
              {/* Corner brackets */}
              {[['top-2 left-2', 'border-l-2 border-t-2'], ['top-2 right-2', 'border-r-2 border-t-2'],
                ['bottom-2 left-2', 'border-l-2 border-b-2'], ['bottom-2 right-2', 'border-r-2 border-b-2']].map(([pos, border]) => (
                <div key={pos} className={`absolute ${pos} w-5 h-5 ${border}`} style={{ borderColor: 'rgba(200,89,10,0.6)' }} />
              ))}
            </div>

            {/* Spectral bands */}
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
              <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9', backgroundColor: '#FAFBFC' }}>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Spectral band response
                </span>
                <span
                  className="font-mono text-[9px] px-2.5 py-1 rounded-full font-medium"
                  style={{ color: C.teal, border: `1px solid ${C.teal}30`, backgroundColor: `${C.teal}08` }}
                >
                  Conceptual diagram
                </span>
              </div>
              <div className="px-5 py-4">
                <SpectralBands />
                <p className="mt-4 font-mono text-[9px] text-slate-400 leading-relaxed border-t pt-3 mt-3" style={{ borderColor: '#F1F5F9' }}>
                  Intensities are illustrative. Not representative of any specific location or measurement.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './sections/HeroSection';
import { ObserveSection } from './sections/ObserveSection';
import { SignalsSection } from './sections/SignalsSection';
import { AIExplorationSection } from './sections/AIExplorationSection';
import { ProductionSection } from './sections/ProductionSection';
import { FinalCTASection } from './sections/FinalCTASection';

interface LandingPageProps {
  navigate: (path: string) => void;
}

// Thin gradient section divider
const SectionDivider: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <div className="w-full" aria-hidden="true">
    <div
      style={{
        height: '1px',
        background: flip
          ? 'linear-gradient(90deg, transparent, rgba(8,145,178,0.25), rgba(200,89,10,0.3), rgba(8,145,178,0.25), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(200,89,10,0.2), rgba(13,27,46,0.1), rgba(200,89,10,0.2), transparent)',
      }}
    />
  </div>
);

// Technology trust belt — shown once between hero and first section
const TechBelt: React.FC = () => {
  const techs = [
    { label: 'Sentinel-2 MSI',   desc: 'Earth observation satellite' },
    { label: 'XGBoost',          desc: 'Gradient boosting classifier' },
    { label: 'SHAP',             desc: 'Feature attribution & XAI' },
    { label: 'SRTM DEM',         desc: 'Terrain elevation model' },
    { label: 'IBM Plex Sans',    desc: 'Typography system' },
    { label: 'React + Vite',     desc: 'Frontend framework' },
    { label: 'Python FastAPI',   desc: 'ML model serving backend' },
    { label: 'MOIL Survey Data', desc: 'Training sample source' },
  ];
  return (
    <div
      className="py-5 px-6 overflow-hidden"
      style={{ backgroundColor: '#FAFBFC', borderTop: '1px solid #E8EDF3', borderBottom: '1px solid #E8EDF3' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {techs.map((t, i) => (
            <div key={t.label} className="flex items-center gap-2 shrink-0">
              {i > 0 && <span className="text-slate-200 hidden sm:block">·</span>}
              <div>
                <span className="text-xs font-bold text-slate-600">{t.label}</span>
                <span className="hidden md:inline text-xs text-slate-400 ml-1.5">{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: "'IBM Plex Sans', sans-serif", backgroundColor: '#f8fafc' }}
    >
      {/* Fixed header */}
      <LandingHeader navigate={navigate} />

      {/* ── 00: Hero ── */}
      <HeroSection navigate={navigate} />

      {/* Tech trust belt */}
      <TechBelt />

      {/* ── 01: Observe the surface ── */}
      <ObserveSection />

      <SectionDivider flip />

      {/* ── 02: Signals / Pipeline ── */}
      <SignalsSection />

      <SectionDivider />

      {/* ── 03: AI / Prospectivity ── */}
      <AIExplorationSection navigate={navigate} />

      <SectionDivider flip />

      {/* ── 04 + 05: Production + What-if ── */}
      <ProductionSection navigate={navigate} />

      <SectionDivider />

      {/* ── Footer / CTA ── */}
      <FinalCTASection navigate={navigate} />
    </div>
  );
};

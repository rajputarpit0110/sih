import React from 'react';
import { Compass, Sliders, ArrowRight, Layers, ShieldCheck, MapPin } from 'lucide-react';

interface HomeProps {
  navigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const moilAssets = [
    { name: 'Balaghat', district: 'Balaghat, MP', type: 'Underground', depth: 385, target: 22000 },
    { name: 'Tirodi', district: 'Balaghat, MP', type: 'Opencast', depth: 95, target: 15000 },
    { name: 'Ukwa', district: 'Balaghat, MP', type: 'Underground', depth: 210, target: 18000 },
    { name: 'Bharweli', district: 'Balaghat, MP', type: 'Underground', depth: 340, target: 20000 },
    { name: 'Gumgaon', district: 'Nagpur, MH', type: 'Underground', depth: 260, target: 14000 },
    { name: 'Kandri', district: 'Nagpur, MH', type: 'Underground', depth: 225, target: 16000 },
    { name: 'Mansar', district: 'Nagpur, MH', type: 'Opencast/UG', depth: 180, target: 12000 },
    { name: 'Dongri Buzurg', district: 'Bhandara, MH', type: 'Opencast', depth: 110, target: 25000 },
    { name: 'Chikla', district: 'Bhandara, MH', type: 'Underground', depth: 290, target: 17000 },
    { name: 'Sitapatore', district: 'Bhandara, MH', type: 'Underground', depth: 195, target: 11000 },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f8fafc] text-slate-900">
      {/* Editorial Entry Screen */}
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 space-y-12">
        {/* Title & Product Narrative */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 font-medium">
            <span className="text-[#c26d3a] font-semibold">MOIL Limited</span>
            <span>•</span>
            <span className="font-mono text-xs">PS 26009</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-[1.2]">
            MINERVA
            <span className="block text-xl sm:text-2xl font-normal text-slate-600 mt-2">
              Manganese exploration & production intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            A geospatial intelligence and operational decision-support platform for the Central India Manganese Belt. Integrates multi-sensor Earth observation rasters with operational mine telemetry to evaluate mineral prospectivity and simulate production target feasibility.
          </p>

          {/* Primary Action Triggers */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center space-x-2 rounded-lg bg-[#c26d3a] hover:bg-[#b45309] text-white px-5 py-2.5 text-sm font-medium transition shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Compass className="h-4 w-4" />
              <span>Explore location</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate('/production')}
              className="flex items-center space-x-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-5 py-2.5 text-sm font-medium transition shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Sliders className="h-4 w-4 text-[#c26d3a]" />
              <span>Production planning</span>
            </button>
          </div>
        </div>

        {/* Operational Metrics Executive Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Active Operating Assets</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">10 Mines</div>
            <span className="text-xs text-slate-500 font-normal">Balaghat, Nagpur, Bhandara</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Baseline Target Capacity</span>
            <div className="text-2xl font-bold text-[#c26d3a] tracking-tight">184,000 t/mo</div>
            <span className="text-xs text-slate-500 font-normal">Underground & Opencast mix</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Earth Observation Rasters</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">47 Features</div>
            <span className="text-xs text-slate-500 font-normal">Sentinel-2, SRTM, Aeromag</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 block">Model Regression Fit</span>
            <div className="text-2xl font-bold text-emerald-700 tracking-tight">98.23% R²</div>
            <span className="text-xs text-slate-500 font-normal">Validated on MOIL historicals</span>
          </div>
        </div>

        {/* Geospatial Asset Map Section - Central India Belt Properties */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Regional coverage
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Central India Manganese Belt — 10 MOIL operating properties
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              Madhya Pradesh & Maharashtra corridors (Balaghat, Nagpur, Bhandara)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {moilAssets.map((asset) => (
              <div
                key={asset.name}
                onClick={() => navigate('/production')}
                className="rounded-lg border border-slate-200/90 bg-white p-3.5 space-y-2 cursor-pointer hover:border-[#c26d3a]/60 hover:shadow-sm hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-[#c26d3a] transition-colors">
                    {asset.name}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {asset.type.split('/')[0]}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{asset.district}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span className="text-slate-500 text-[11px]">{asset.depth}m depth</span>
                  <span className="text-slate-900 font-bold font-mono text-xs">{asset.target / 1000}k t/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three Core Pillars: What the System Does */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Pillar 1 */}
          <div className="space-y-2 border-l-2 border-slate-300 pl-4">
            <div className="flex items-center space-x-2 text-base font-semibold text-slate-900">
              <Compass className="h-4.5 w-4.5 text-[#c26d3a]" />
              <span>Exploration intelligence</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              1km² spatial resolution mineral prospectivity probability calculated using multispectral Sentinel-2 imagery, SRTM elevation, lithology rasters, and fault density.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-2 border-l-2 border-slate-300 pl-4">
            <div className="flex items-center space-x-2 text-base font-semibold text-slate-900">
              <Sliders className="h-4.5 w-4.5 text-[#c26d3a]" />
              <span>Production planning</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Target feasibility evaluation and quantitative shortfall risk prediction based on mechanical fleet hours, blasting cycle performance, and logistics bottlenecks.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-2 border-l-2 border-slate-300 pl-4">
            <div className="flex items-center space-x-2 text-base font-semibold text-slate-900">
              <Layers className="h-4.5 w-4.5 text-[#c26d3a]" />
              <span>Decision support & what-if</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              TreeSHAP feature attributions explaining model signals, prioritized engineering responses, and side-by-side counterfactual simulation workbenches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

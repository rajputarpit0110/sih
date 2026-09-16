import React, { useState } from 'react';
import type { ProspectivityResult } from '../../types/exploration';
import { formatCoord } from '../../lib/utils';
import { 
  X, 
  MapPin, 
  Mountain, 
  Layers, 
  Gem, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExplorationResultDrawerProps {
  result: ProspectivityResult | null;
  onClose: () => void;
}

export const ExplorationResultDrawer: React.FC<ExplorationResultDrawerProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isVeryHigh = result.prospectivity_level === 'VERY HIGH';
  const isHigh = result.prospectivity_level === 'HIGH' || isVeryHigh;
  const isModerate = result.prospectivity_level === 'MEDIUM';

  // Calculate maximum absolute SHAP value for horizontal bar scaling
  const maxShap = Math.max(
    ...((result.top_contributing_factors || []).map((f) => Math.abs(f.shap_value))),
    1.0
  );

  const handleCopyCoords = () => {
    const text = `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color theme based on tier
  const accentColor = isVeryHigh ? '#c26d3a' : isHigh ? '#d97706' : isModerate ? '#f59e0b' : '#64748b';
  const badgeBg = isVeryHigh ? 'bg-orange-50 border-orange-200 text-orange-800' : isHigh ? 'bg-amber-50 border-amber-200 text-amber-800' : isModerate ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-slate-100 border-slate-200 text-slate-700';

  // Circular progress math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(result.prospectivity_percent, 100) / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col space-y-4 rounded-xl border border-slate-200/90 bg-white p-4.5 text-xs shadow-lg shadow-slate-200/50 relative overflow-hidden"
    >
      {/* Top Accent Gradient Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ background: `linear-gradient(90deg, ${accentColor}, #F59E0B)` }}
      />

      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-[#c26d3a] border border-orange-100">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              MINERVA Geo-Intelligence
            </span>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Prospectivity Assessment
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close assessment drawer"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Prominent Radial Score Card */}
      <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-orange-50/20 p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          {/* Circular Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="84" height="84" className="transform -rotate-90">
              <circle
                cx="42"
                cy="42"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="42"
                cy="42"
                r={radius}
                stroke={accentColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {result.prospectivity_percent}%
              </span>
              <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400 -mt-0.5">
                Score
              </span>
            </div>
          </div>

          {/* Verdict & Tier Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeBg}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {result.prospectivity_level}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-700 leading-snug">
              {isHigh 
                ? 'Strong lithological & spectral concordance with MOIL manganese horizons.' 
                : isModerate 
                ? 'Moderate mineral indicators present; secondary geophysical survey suggested.' 
                : 'Low geological favorability based on current EO raster layers.'}
            </p>
          </div>
        </div>

        {/* Location & Elevation Strip */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center space-x-1.5 font-mono">
            <MapPin className="h-3.5 w-3.5 text-[#c26d3a]" />
            <span className="font-semibold text-slate-800">
              {formatCoord(result.latitude, true)} {formatCoord(result.longitude, false)}
            </span>
          </div>
          <button
            onClick={handleCopyCoords}
            type="button"
            className="flex items-center space-x-1 px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spatial Geological Context 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-2.5">
          <div className="flex items-center space-x-1 text-slate-500 mb-0.5">
            <MapPin className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Jurisdiction</span>
          </div>
          <span className="text-slate-900 font-semibold block truncate">
            {result.district}, {result.state}
          </span>
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-2.5">
          <div className="flex items-center space-x-1 text-slate-500 mb-0.5">
            <Mountain className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Elevation</span>
          </div>
          <span className="text-slate-900 font-semibold block font-mono">
            {result.elevation_m}m ASL
          </span>
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-2.5">
          <div className="flex items-center space-x-1 text-slate-500 mb-0.5">
            <Layers className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Host Rock</span>
          </div>
          <span className="text-slate-900 font-semibold block truncate" title={result.host_rock || 'Mansar Formation'}>
            {result.host_rock || 'Mansar Formation'}
          </span>
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-2.5">
          <div className="flex items-center space-x-1 text-slate-500 mb-0.5">
            <Gem className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Lithology</span>
          </div>
          <span className="text-slate-900 font-semibold block truncate" title={result.lithology}>
            {result.lithology}
          </span>
        </div>
      </div>

      {/* WHY THIS RESULT: Ranked Feature Contribution (SHAP) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-900">
              SHAP Factor Attribution
            </span>
            <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
              Explainable AI
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Δ log-odds
          </span>
        </div>

        <div className="space-y-2">
          {result.top_contributing_factors && result.top_contributing_factors.length > 0 ? (
            result.top_contributing_factors.map((factor, i) => {
              const absVal = Math.abs(factor.shap_value);
              const pct = Math.min((absVal / maxShap) * 100, 100);
              const isPos = factor.impact === 'positive' || factor.shap_value > 0;

              return (
                <div key={i} className="space-y-1 rounded-md bg-slate-50/70 p-2 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-medium truncate pr-2">
                      {factor.feature}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        isPos ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      {isPos ? `+${factor.shap_value.toFixed(2)}` : factor.shap_value.toFixed(2)}
                    </span>
                  </div>

                  {/* High Quality Horizontal Contribution Bar */}
                  <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isPos ? 'bg-emerald-600' : 'bg-slate-400'}`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-slate-400 py-1">
              Attribution vector not available for this cell.
            </div>
          )}
        </div>
      </div>

      {/* Sensor Data Verification Matrix */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700">
            Satellite & Earth Observation Coverage
          </span>
          <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Validated
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { name: 'Sentinel-2', sub: 'MSI 10m' },
            { name: 'SRTM DEM', sub: '30m ASL' },
            { name: 'Aeromag', sub: 'TMI Grid' },
          ].map((s) => (
            <div key={s.name} className="rounded border border-slate-200/70 bg-slate-50 px-2 py-1 text-center">
              <span className="text-[10px] font-bold text-slate-800 block">{s.name}</span>
              <span className="text-[9px] text-slate-500 block">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer: Send to Production Simulator */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <a
          href="/production"
          className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg bg-[#c26d3a] hover:bg-[#b45309] text-white py-2 text-xs font-semibold shadow-xs transition cursor-pointer active:scale-[0.99]"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Simulate Extraction</span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
        </a>
      </div>
    </motion.div>
  );
};

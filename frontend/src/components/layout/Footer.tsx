import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="text-slate-800 font-semibold">MINERVA</span>
          <span>•</span>
          <span>MOIL Limited</span>
          <span>•</span>
          <span className="font-mono text-[11px] text-slate-500">SIH 2026 PS 26009</span>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[11px] text-slate-500">
          <span>WGS84 EPSG:4326</span>
          <span>•</span>
          <span>Sentinel-2 L2A</span>
          <span>•</span>
          <span>SRTM 30m</span>
          <span>•</span>
          <span className="text-slate-700 font-medium">XGBoost Pipelines</span>
        </div>
      </div>
    </footer>
  );
};

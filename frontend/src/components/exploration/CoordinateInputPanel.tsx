import React, { useState, useEffect } from 'react';
import { Crosshair, ArrowRight, AlertCircle, Compass, Sparkles } from 'lucide-react';

interface CoordinateInputPanelProps {
  selectedCoords: { lat: number; lng: number } | null;
  onAnalyze: (lat: number, lng: number) => void;
  isLoading: boolean;
}

export const CoordinateInputPanel: React.FC<CoordinateInputPanelProps> = ({
  selectedCoords,
  onAnalyze,
  isLoading,
}) => {
  const [inputLat, setInputLat] = useState<string>('21.8217');
  const [inputLng, setInputLng] = useState<string>('80.1986');
  const [warning, setWarning] = useState<string | null>(null);

  // Sync inputs whenever map click coordinates change
  useEffect(() => {
    if (selectedCoords) {
      setInputLat(selectedCoords.lat.toFixed(4));
      setInputLng(selectedCoords.lng.toFixed(4));
    }
  }, [selectedCoords]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);

    if (isNaN(lat) || isNaN(lng)) {
      setWarning('Coordinates must be valid decimal numbers.');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setWarning('Coordinates out of range (-90..90, -180..180).');
      return;
    }

    // India bounding box check
    const inIndia = lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 98.0;
    if (!inIndia) {
      setWarning('Notice: Target is outside India. Model is calibrated for Central India.');
    } else {
      setWarning(null);
    }

    onAnalyze(lat, lng);
  };

  const depositPresets = [
    { name: 'Balaghat', lat: '21.8217', lng: '80.1986', note: 'Underground' },
    { name: 'Tirodi', lat: '21.6840', lng: '79.7120', note: 'Opencast' },
    { name: 'Ukwa', lat: '21.9680', lng: '80.4680', note: 'Underground' },
    { name: 'Gumgaon', lat: '21.3850', lng: '79.0120', note: 'Nagpur' },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-50 text-[#c26d3a]">
            <Crosshair className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Coordinate Inspection
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Central India Belt Grid
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold border border-slate-200">
          WGS84 EPSG:4326
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Lat / Lng inputs */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="coord-lat-input" className="block text-[11px] text-slate-600 mb-1 font-semibold">
              Latitude (°N)
            </label>
            <div className="relative">
              <input
                id="coord-lat-input"
                type="number"
                step="any"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                aria-label="Latitude in decimal degrees north"
                className="w-full rounded-lg border border-slate-300/80 bg-slate-50/50 px-3 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-[#c26d3a] focus:bg-white focus:ring-2 focus:ring-[#c26d3a]/20 focus:outline-none transition shadow-2xs"
                placeholder="21.8217"
              />
            </div>
          </div>

          <div>
            <label htmlFor="coord-lng-input" className="block text-[11px] text-slate-600 mb-1 font-semibold">
              Longitude (°E)
            </label>
            <div className="relative">
              <input
                id="coord-lng-input"
                type="number"
                step="any"
                value={inputLng}
                onChange={(e) => setInputLng(e.target.value)}
                aria-label="Longitude in decimal degrees east"
                className="w-full rounded-lg border border-slate-300/80 bg-slate-50/50 px-3 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-[#c26d3a] focus:bg-white focus:ring-2 focus:ring-[#c26d3a]/20 focus:outline-none transition shadow-2xs"
                placeholder="80.1986"
              />
            </div>
          </div>
        </div>

        {/* Quick Deposit Presets */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Known Deposit Anchors:
            </span>
            <span className="text-[10px] text-slate-400">1-click inspect</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {depositPresets.map((p) => {
              const isActive = inputLat === p.lat && inputLng === p.lng;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setInputLat(p.lat);
                    setInputLng(p.lng);
                    onAnalyze(parseFloat(p.lat), parseFloat(p.lng));
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-orange-50 border-[#c26d3a] text-[#c26d3a] font-bold shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200/80 font-medium'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[9px] opacity-70 text-slate-500">{p.note}</span>
                </button>
              );
            })}
          </div>
        </div>

        {warning && (
          <div className="flex items-start space-x-2 text-xs text-amber-900 bg-amber-50/90 border border-amber-200 rounded-lg p-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <span className="text-[11px] leading-relaxed">{warning}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 rounded-lg bg-[#c26d3a] hover:bg-[#b45309] text-white py-2.5 font-bold text-xs transition-all shadow-xs hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing 47 Earth Observation Layers...</span>
            </>
          ) : (
            <>
              <Compass className="h-3.5 w-3.5" />
              <span>Evaluate Mineral Prospectivity</span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { IndiaMap } from '../components/map/IndiaMap';
import { CoordinateInputPanel } from '../components/exploration/CoordinateInputPanel';
import { DataEnrichmentProgress } from '../components/exploration/DataEnrichmentProgress';
import { ExplorationResultDrawer } from '../components/exploration/ExplorationResultDrawer';
import { fetchMines, predictProspectivity } from '../api/exploration';
import type { MineLocation, ProspectivityResult } from '../types/exploration';
import { AlertCircle, SlidersHorizontal } from 'lucide-react';
import { formatCoord } from '../lib/utils';

export const Explore: React.FC = () => {
  const [mines, setMines] = useState<MineLocation[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 21.8217,
    lng: 80.1986,
  }); // Default to Balaghat Manganese belt
  const [result, setResult] = useState<ProspectivityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const mineData = await fetchMines();
        setMines(mineData);
      } catch (err: any) {
        console.error('Failed to load exploration data:', err);
      }
    }
    loadData();
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setErrorMessage(null);
  };

  const handleSelectMine = (mine: MineLocation) => {
    setSelectedCoords({ lat: mine.latitude, lng: mine.longitude });
    setErrorMessage(null);
  };

  const handleAnalyzeCoords = async (lat: number, lng: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await predictProspectivity(lat, lng);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Check backend service status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#f8fafc]">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900">
            Manganese exploration
          </h1>
          <p className="text-xs text-slate-500">
            Select a location to evaluate mineral prospectivity.
          </p>
        </div>

        {selectedCoords && (
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded">
            <span className="text-slate-500">Coordinates:</span>
            <span className="text-slate-800 font-medium font-mono">
              {formatCoord(selectedCoords.lat, true)}   {formatCoord(selectedCoords.lng, false)}
            </span>
          </div>
        )}
      </div>

      {/* Main Spacious Map Area (75-80% Viewport) + Contextual Panel */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        {/* Full Interactive GIS Map */}
        <div className="flex-1 h-full relative">
          <IndiaMap
            mines={mines}
            selectedCoords={selectedCoords}
            onMapClick={handleMapClick}
            onSelectMine={handleSelectMine}
            onAnalyzeCoords={handleAnalyzeCoords}
            result={result}
          />
        </div>

        {/* Right Contextual Inspection Panel / Drawer */}
        <div className="w-full lg:w-[360px] xl:w-[400px] border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/70 p-4 overflow-y-auto space-y-4 shrink-0">
          {/* Coordinate Input Tool */}
          <CoordinateInputPanel
            selectedCoords={selectedCoords}
            onAnalyze={handleAnalyzeCoords}
            isLoading={isLoading}
          />

          {/* Sequential Processing State */}
          <DataEnrichmentProgress isLoading={isLoading} />

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start space-x-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Execution Failed</span>
                <span className="text-[11px]">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Prospectivity Result Drawer */}
          {result && !isLoading && (
            <ExplorationResultDrawer
              result={result}
              onClose={() => setResult(null)}
            />
          )}

          {/* Clean Guidance Note when idle */}
          {!result && !isLoading && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-xs space-y-3">
              <div className="text-slate-900 font-semibold flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-1.5 text-xs">
                  <SlidersHorizontal className="h-4 w-4 text-[#c26d3a]" />
                  <span>Exploration Protocol</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                  47 EO Rasters
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-normal">
                <div className="flex items-start space-x-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-[#c26d3a] mt-0.5">
                    1
                  </span>
                  <span>Click any coordinate on the Central India belt map or use the quick deposit presets above.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-[#c26d3a] mt-0.5">
                    2
                  </span>
                  <span>Automated multi-sensor sampling fetches Sentinel-2 MSI, SRTM DEM, and aeromagnetic anomaly proxies.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-[#c26d3a] mt-0.5">
                    3
                  </span>
                  <span>XGBoost classifier predicts deposit probability, deposit tier, and borehole drilling priority.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

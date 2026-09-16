import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { MineLocation, ProspectivityResult } from '../../types/exploration';
import { formatCoord } from '../../lib/utils';
import { RotateCcw, Crosshair } from 'lucide-react';

interface IndiaMapProps {
  mines: MineLocation[];
  selectedCoords: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
  onSelectMine: (mine: MineLocation) => void;
  onAnalyzeCoords: (lat: number, lng: number) => void;
  result: ProspectivityResult | null;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  mines,
  selectedCoords,
  onMapClick,
  onSelectMine,
  onAnalyzeCoords,
  result,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const minesLayerRef = useRef<L.LayerGroup | null>(null);

  const [showMines, setShowMines] = useState(true);
  const [basemapType, setBasemapType] = useState<'street' | 'light' | 'satellite' | 'dark'>('street');
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Basemap URLs - 100% Free, Zero Watermark, Clean GIS Cartography
  const basemaps = {
    light: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Central India Manganese Belt (Balaghat / Nagpur Zone: 21.6°N, 79.8°E)
    const map = L.map(mapContainerRef.current, {
      center: [21.6, 79.8],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    const initialTiles = L.tileLayer(basemaps[basemapType], {
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = initialTiles;

    // Custom unobtrusive zoom control bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Mines Layer Group
    const minesGroup = L.layerGroup().addTo(map);
    minesLayerRef.current = minesGroup;

    // Click handler for coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Live mousemove coordinate tracker for HUD
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    map.on('mouseout', () => {
      setCursorCoords(null);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(basemaps[basemapType]);
  }, [basemapType]);

  // Render MOIL Mine Asset Markers (Scientific Hex / Survey Circle)
  useEffect(() => {
    if (!mapInstanceRef.current || !minesLayerRef.current) return;
    minesLayerRef.current.clearLayers();

    if (!showMines) return;

    mines.forEach((mine) => {
      const mineIcon = L.divIcon({
        className: 'moil-mine-asset',
        html: `
          <div style="
            position: relative;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              width: 14px;
              height: 14px;
              background: #ffffff;
              border: 1.5px solid #c26d3a;
              border-radius: 2px;
              transform: rotate(45deg);
              box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            "></div>
            <div style="
              position: absolute;
              width: 4px;
              height: 4px;
              background: #c26d3a;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([mine.latitude, mine.longitude], { icon: mineIcon });

      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="min-width: 190px; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-size: 12px; font-weight: 600; color: #0f172a;">
              ${mine.mine_name} Mine
            </span>
            <span style="font-family: monospace; font-size: 10px; color: #c26d3a; background: rgba(194, 109, 58, 0.12); padding: 1px 5px; border-radius: 2px; font-weight: 600;">
              ${mine.mine_id}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            ${mine.district}, ${mine.state} (${mine.type})
          </div>
          <div style="font-family: monospace; font-size: 10px; color: #64748b; margin-bottom: 8px;">
            ${formatCoord(mine.latitude, true)}  ${formatCoord(mine.longitude, false)}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; font-family: monospace; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-bottom: 8px;">
            <div><span style="color: #64748b;">Depth:</span> <span style="color: #0f172a; font-weight: 600;">${mine.mine_depth_m}m</span></div>
            <div><span style="color: #64748b;">Target:</span> <span style="color: #c26d3a; font-weight: 600;">${Math.round(mine.avg_target_tonnes).toLocaleString()}t</span></div>
          </div>
          <button id="inspect-mine-${mine.mine_id}" style="
            width: 100%;
            background: #f1f5f9;
            color: #0f172a;
            border: 1px solid #cbd5e1;
            border-radius: 3px;
            padding: 6px 8px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            transition: all 0.15s;
          ">
            Inspect Location
          </button>
        </div>
      `;

      popupContent.querySelector(`#inspect-mine-${mine.mine_id}`)?.addEventListener('click', () => {
        onSelectMine(mine);
        onAnalyzeCoords(mine.latitude, mine.longitude);
      });

      marker.bindPopup(popupContent);
      minesLayerRef.current?.addLayer(marker);
    });
  }, [mines, showMines]);

  // Render Selected Target Point with Precision Crosshair Reticle
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedMarkerRef.current) {
      mapInstanceRef.current.removeLayer(selectedMarkerRef.current);
      selectedMarkerRef.current = null;
    }

    if (!selectedCoords) return;

    const crosshairIcon = L.divIcon({
      className: 'scientific-crosshair-marker',
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Pulse Ring -->
          <div class="reticle-ping"></div>

          <!-- Outer Reticle Circle -->
          <div style="
            position: absolute;
            width: 20px;
            height: 20px;
            border: 1.5px solid #c26d3a;
            border-radius: 50%;
            background: rgba(17, 20, 28, 0.7);
          "></div>

          <!-- Center Point -->
          <div style="
            position: absolute;
            width: 4px;
            height: 4px;
            background: #f0f3f6;
            border-radius: 50%;
          "></div>

          <!-- Crosshair Lines -->
          <div style="position: absolute; top: 0; left: 15px; width: 2px; height: 6px; background: #c26d3a;"></div>
          <div style="position: absolute; bottom: 0; left: 15px; width: 2px; height: 6px; background: #c26d3a;"></div>
          <div style="position: absolute; left: 0; top: 15px; width: 6px; height: 2px; background: #c26d3a;"></div>
          <div style="position: absolute; right: 0; top: 15px; width: 6px; height: 2px; background: #c26d3a;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([selectedCoords.lat, selectedCoords.lng], { icon: crosshairIcon }).addTo(
      mapInstanceRef.current
    );

    const popupContainer = document.createElement('div');
    popupContainer.innerHTML = `
      <div style="min-width: 170px; font-family: inherit;">
        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 3px;">
          Survey Target
        </div>
        <div style="font-family: monospace; font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">
          ${formatCoord(selectedCoords.lat, true)}<br/>
          ${formatCoord(selectedCoords.lng, false)}
        </div>
        ${
          result
            ? `
            <div style="border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <div style="font-size: 10px; color: #64748b;">Prospectivity:</div>
              <div style="font-family: monospace; font-size: 13px; font-weight: 700; color: #c26d3a;">
                ${result.prospectivity_percent}% (${result.prospectivity_level})
              </div>
            </div>
          `
            : `
            <button id="btn-analyze-selected" style="
              width: 100%;
              background: #c26d3a;
              color: #ffffff;
              border: none;
              border-radius: 3px;
              padding: 6px 8px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">
              Analyze Location
            </button>
          `
        }
      </div>
    `;

    popupContainer.querySelector('#btn-analyze-selected')?.addEventListener('click', () => {
      onAnalyzeCoords(selectedCoords.lat, selectedCoords.lng);
    });

    marker.bindPopup(popupContainer);
    selectedMarkerRef.current = marker;
  }, [selectedCoords, result]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.6, 79.8], 7);
    }
  };

  const locateSelection = () => {
    if (mapInstanceRef.current && selectedCoords) {
      mapInstanceRef.current.setView([selectedCoords.lat, selectedCoords.lng], 10);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8fafc]">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Scientific GIS Tool Bar */}
      <div
        aria-label="Map Control Toolbar"
        className="absolute top-4 left-4 z-[400] flex items-center space-x-1.5 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-2.5 py-1.5 text-xs shadow-lg shadow-slate-200/50"
      >
        {/* Mines Toggle */}
        <button
          type="button"
          onClick={() => setShowMines(!showMines)}
          aria-label={showMines ? 'Hide MOIL Mines' : 'Show MOIL Mines'}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 min-h-[30px] rounded-lg text-[11px] font-semibold transition cursor-pointer active:scale-[0.98] ${
            showMines
              ? 'text-[#c26d3a] bg-orange-50/80 border border-orange-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="h-2 w-2 rounded-sm border border-[#c26d3a] rotate-45 inline-block" />
          <span>MOIL Mines ({mines.length})</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Basemap Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
          {(['street', 'light', 'satellite', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBasemapType(mode)}
              aria-label={`Switch basemap to ${mode}`}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all cursor-pointer active:scale-[0.98] ${
                basemapType === mode
                  ? 'text-slate-900 bg-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Reset View */}
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset map view to Central India"
          title="Reset to Central India Belt"
          className="p-1.5 min-h-[30px] min-w-[30px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {selectedCoords && (
          <button
            type="button"
            onClick={locateSelection}
            aria-label="Pan to selected target coordinates"
            title="Pan to Target Coordinates"
            className="p-1.5 min-h-[30px] min-w-[30px] flex items-center justify-center rounded-lg text-[#c26d3a] hover:text-[#b45309] bg-orange-50 hover:bg-orange-100/70 border border-orange-200/60 transition cursor-pointer active:scale-[0.98]"
          >
            <Crosshair className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Cartographic Scale, Live Cursor Telemetry & Legend */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center space-x-3 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs text-slate-600 shadow-lg shadow-slate-200/40">
        {/* Live Cursor Coordinate HUD */}
        <div className="flex items-center space-x-1.5 font-mono text-[11px]">
          <Crosshair className="h-3.5 w-3.5 text-[#c26d3a]" />
          <span className="font-semibold text-slate-800">
            {cursorCoords 
              ? `${formatCoord(cursorCoords.lat, true)}  ${formatCoord(cursorCoords.lng, false)}` 
              : '21.6000°N  79.8000°E'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-slate-200" />

        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-sm border border-[#c26d3a] rotate-45 inline-block" />
          <span className="text-slate-700 font-medium text-[11px]">MOIL Asset</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-200" />

        <div className="flex items-center space-x-1.5">
          <span className="h-2 w-2 rounded-full border border-[#c26d3a] inline-block" />
          <span className="text-slate-700 font-medium text-[11px]">Reticle Target</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-200 hidden sm:block" />
        <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">EPSG:4326</span>
      </div>
    </div>
  );
};

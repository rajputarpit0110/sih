import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function ProspectivityMap({ points, onSelectPoint }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.4, 78.8],
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Balanced sampling to ensure all risk/potential tiers appear on the map
    let sample = [];
    if (points.length <= 800) {
      sample = points;
    } else {
      const tiers = ['VERY HIGH', 'HIGH', 'MEDIUM', 'LOW'];
      const targetPerTier = 200;
      tiers.forEach((lvl) => {
        const tierPoints = points.filter((p) => p.prospectivity_level === lvl);
        if (tierPoints.length <= targetPerTier) {
          sample.push(...tierPoints);
        } else {
          const step = Math.ceil(tierPoints.length / targetPerTier);
          sample.push(...tierPoints.filter((_, i) => i % step === 0));
        }
      });
      // Fallback if tiers filter was applied (e.g. only LOW is selected)
      if (sample.length === 0) {
        sample = points.slice(0, 800);
      }
    }

    const getColor = (lvl) => {
      switch (lvl) {
        case 'VERY HIGH': return '#00e676';
        case 'HIGH': return '#00e5ff';
        case 'MEDIUM': return '#ffab40';
        default: return '#ff5252';
      }
    };

    sample.forEach((pt) => {
      if (!pt.latitude || !pt.longitude) return;
      const color = getColor(pt.prospectivity_level);
      const marker = L.circleMarker([pt.latitude, pt.longitude], {
        radius: pt.prospectivity_level === 'VERY HIGH' ? 6.5 : 5,
        fillColor: color,
        color: '#ffffff',
        weight: 1,
        opacity: 0.85,
        fillOpacity: 0.85,
      });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 180px; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: ${color}; margin-bottom: 4px;">
            ${pt.cell_id}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 2px;">
            ${pt.state} · ${pt.district || 'Regional Grid'}
          </div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">
            (${pt.latitude.toFixed(3)}°N, ${pt.longitude.toFixed(3)}°E)
          </div>
          <div style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between; border-top: 1px solid #1e2d4d; padding-top: 6px;">
            <span style="color: #cbd5e1;">Prospectivity:</span>
            <b style="color: #fff;">${(pt.prospectivity_prob * 100).toFixed(1)}%</b>
          </div>
          <div style="margin-top: 6px; font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase;">
            ● ${pt.prospectivity_level} POTENTIAL
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectPoint) onSelectPoint(pt);
      });

      layerGroup.addLayer(marker);
    });

    // Invalidate size after layout
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  }, [points, onSelectPoint]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainerRef} className="map-container" />
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: 'rgba(13, 22, 48, 0.92)',
          border: '1px solid #1e2d4d',
          padding: '10px 14px',
          borderRadius: '8px',
          zIndex: 400,
          fontSize: '11px',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '6px', color: '#e2e8f0' }}>Prospectivity Tiers</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e676' }}></span>
            <span>Very High (≥ 70%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e5ff' }}></span>
            <span>High (50% – 70%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffab40' }}></span>
            <span>Medium (30% – 50%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5252' }}></span>
            <span>Low (&lt; 30%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

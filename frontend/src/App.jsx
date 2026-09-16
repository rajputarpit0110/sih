import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverviewView from './views/OverviewView';
import ProspectivityView from './views/ProspectivityView';
import ProductivityView from './views/ProductivityView';
import ComparisonView from './views/ComparisonView';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/frontend_data.json');
        if (!res.ok) {
          throw new Error(`Failed to load dataset: ${res.statusText}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Data load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div style={{ fontWeight: 700, letterSpacing: '-0.3px', color: '#e2e8f0' }}>
          Loading MineIQ Telemetry...
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
          Hydrating 3,000 geological prospectivity cells and 1,320 production events
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="loading-screen" style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--red)', marginBottom: '8px' }}>
          Telemetry Data Unavailable
        </div>
        <div style={{ color: 'var(--text2)', maxWidth: '400px', fontSize: '13px', lineHeight: '1.6' }}>
          {error || 'Could not locate frontend_data.json in public assets.'}
        </div>
        <button
          className="pg-btn"
          style={{ marginTop: '16px', background: 'var(--cyan)', color: '#060d1f', fontWeight: 700 }}
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        onViewChange={(v) => setActiveView(v)}
        meta={data.meta}
      />

      <main className="main-content">
        {activeView === 'overview' && <OverviewView data={data} />}
        {activeView === 'prospectivity' && <ProspectivityView data={data} />}
        {activeView === 'productivity' && <ProductivityView data={data} />}
        {activeView === 'comparison' && <ComparisonView data={data} />}
      </main>
    </div>
  );
}

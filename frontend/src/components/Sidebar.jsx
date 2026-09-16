import React from 'react';
import { LayoutDashboard, Compass, Pickaxe, GitCompare, Activity } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, meta }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'prospectivity', label: 'Prospectivity Model', icon: Compass },
    { id: 'productivity', label: 'Productivity Model', icon: Pickaxe },
    { id: 'comparison', label: 'Model Comparison', icon: GitCompare },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="logo-icon">M</div>
        <div className="logo-text">
          <div className="logo-title">MineIQ</div>
          <div className="logo-sub">Manganese Intelligence</div>
        </div>
      </div>

      <nav className="sb-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sb-footer">
        <div className="sb-badge">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--green)', fontWeight: '600', marginBottom: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }}></span>
            Models Online
          </div>
          <div>Dual ML Pipelines v2.4</div>
          <div style={{ color: 'var(--text3)', fontSize: '10px', marginTop: '2px' }}>
            {meta?.mines?.length || 10} Mines · MP & MH
          </div>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';

export default function StatCard({ label, value, sub, accent = 'var(--cyan)', accent2 = 'var(--cyan2)', icon: Icon }) {
  return (
    <div className="stat-card" style={{ '--accent': accent, '--accent2': accent2 }}>
      <div className="label">
        <span>{label}</span>
        {Icon && <Icon size={16} style={{ color: accent }} />}
      </div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

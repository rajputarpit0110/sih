import React from 'react';

export default function Pagination({ total, perPage, current, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (total === 0) return null;

  const startIdx = current * perPage + 1;
  const endIdx = Math.min((current + 1) * perPage, total);

  // Generate page numbers
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination">
      <div className="pg-info">
        Showing <b>{startIdx}</b>–<b>{endIdx}</b> of <b>{total.toLocaleString()}</b> records
      </div>

      <div className="pg-controls">
        <button
          className="pg-btn"
          disabled={current === 0}
          onClick={() => onChange(current - 1)}
        >
          ‹
        </button>

        {pages.map((p, idx) => {
          if (p === '...') {
            return <span key={`ellipsis-${idx}`} className="pg-info" style={{ padding: '0 4px' }}>…</span>;
          }
          return (
            <button
              key={p}
              className={`pg-btn ${p === current ? 'active' : ''}`}
              onClick={() => onChange(p)}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          className="pg-btn"
          disabled={current >= totalPages - 1}
          onClick={() => onChange(current + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

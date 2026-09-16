import React, { useState, useMemo, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { GitCompare, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export default function ComparisonView({ data }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'both' | 'prosp' | 'prod' | 'low'
  const scatterRef = useRef(null);
  const barRef = useRef(null);

  const compData = data?.comparison || [];
  const thresholds = { prosp: 0.45, prod: 94.5 };

  // Filtered mines based on quadrant
  const filteredMines = useMemo(() => {
    return compData.filter((d) => {
      const isHighProsp = d.avg_prospectivity >= thresholds.prosp;
      const isHighProd = d.avg_achievement >= thresholds.prod;

      if (activeFilter === 'all') return true;
      if (activeFilter === 'both') return isHighProsp && isHighProd;
      if (activeFilter === 'prosp') return isHighProsp && !isHighProd;
      if (activeFilter === 'prod') return !isHighProsp && isHighProd;
      if (activeFilter === 'low') return !isHighProsp && !isHighProd;
      return true;
    });
  }, [compData, activeFilter]);

  // Render Charts
  useEffect(() => {
    if (!compData.length) return;
    const charts = [];

    // 1. Scatter Plot (Prospectivity Score on X, Productivity Achievement on Y)
    if (scatterRef.current) {
      const ctx = scatterRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Mines',
            data: filteredMines.map((d) => ({
              x: +(d.avg_prospectivity * 100).toFixed(2),
              y: +d.avg_achievement.toFixed(2),
              mine: d.mine,
              state: d.state,
              shortfall: (d.shortfall_rate * 100).toFixed(1),
            })),
            backgroundColor: filteredMines.map((d) => {
              const hp = d.avg_prospectivity >= thresholds.prosp;
              const hprod = d.avg_achievement >= thresholds.prod;
              if (hp && hprod) return '#00e676';
              if (hp && !hprod) return '#00e5ff';
              if (!hp && hprod) return '#ffab40';
              return '#ff5252';
            }),
            borderColor: '#ffffff',
            borderWidth: 1.5,
            pointRadius: 11,
            pointHoverRadius: 15,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0d1630',
              borderColor: '#1e2d4d',
              borderWidth: 1,
              callbacks: {
                title: (items) => items[0]?.raw?.mine + ` (${items[0]?.raw?.state})`,
                label: (ctx) => [
                  `Prospectivity Score: ${ctx.raw.x}%`,
                  `Production Achievement: ${ctx.raw.y}%`,
                  `Shortfall Frequency: ${ctx.raw.shortfall}%`
                ]
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'State Manganese Prospectivity Potential (%)',
                color: '#00e5ff',
                font: { family: 'Inter', weight: 600 }
              },
              grid: { color: 'rgba(30, 45, 77, 0.4)' },
              ticks: { color: '#94a3b8' },
              min: 36,
              max: 56,
            },
            y: {
              title: {
                display: true,
                text: 'Historical Mine Output Achievement (%)',
                color: '#ffab40',
                font: { family: 'Inter', weight: 600 }
              },
              grid: { color: 'rgba(30, 45, 77, 0.4)' },
              ticks: { color: '#94a3b8' },
              min: 93,
              max: 96.5,
            }
          }
        },
        plugins: [
          {
            id: 'mineLabels',
            afterDraw: (chart) => {
              const ctx2 = chart.ctx;
              chart.data.datasets[0].data.forEach((pt, idx) => {
                const meta = chart.getDatasetMeta(0).data[idx];
                if (!meta) return;
                ctx2.save();
                ctx2.fillStyle = '#e2e8f0';
                ctx2.font = '600 11px Inter';
                ctx2.textAlign = 'center';
                ctx2.fillText(pt.mine, meta.x, meta.y - 14);
                ctx2.restore();
              });

              // Draw quadrant dashed threshold lines
              const { x: xAxis, y: yAxis } = chart.scales;
              const xMid = xAxis.getPixelForValue(thresholds.prosp * 100);
              const yMid = yAxis.getPixelForValue(thresholds.prod);

              ctx2.save();
              ctx2.strokeStyle = 'rgba(255, 255, 255, 0.15)';
              ctx2.lineWidth = 1.5;
              ctx2.setLineDash([4, 4]);

              // Vertical threshold
              ctx2.beginPath();
              ctx2.moveTo(xMid, chart.chartArea.top);
              ctx2.lineTo(xMid, chart.chartArea.bottom);
              ctx2.stroke();

              // Horizontal threshold
              ctx2.beginPath();
              ctx2.moveTo(chart.chartArea.left, yMid);
              ctx2.lineTo(chart.chartArea.right, yMid);
              ctx2.stroke();
              ctx2.restore();
            }
          }
        ]
      });
      charts.push(c);
    }

    // 2. Combined Bar Chart (Prospectivity % vs Shortfall Rate %)
    if (barRef.current) {
      const ctx = barRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: filteredMines.map((d) => d.mine),
          datasets: [
            {
              label: 'Prospectivity Score (%)',
              data: filteredMines.map((d) => +(d.avg_prospectivity * 100).toFixed(1)),
              backgroundColor: 'rgba(0, 229, 255, 0.4)',
              borderColor: '#00e5ff',
              borderWidth: 1.5,
              borderRadius: 4,
            },
            {
              label: 'Shortfall Rate (%)',
              data: filteredMines.map((d) => +(d.shortfall_rate * 100).toFixed(1)),
              backgroundColor: 'rgba(255, 82, 82, 0.4)',
              borderColor: '#ff5252',
              borderWidth: 1.5,
              borderRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#cbd5e1' } },
            tooltip: { backgroundColor: '#0d1630', borderColor: '#1e2d4d', borderWidth: 1 }
          },
          scales: {
            x: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } } },
            y: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
      charts.push(c);
    }

    return () => charts.forEach((c) => c.destroy());
  }, [filteredMines]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cross-Model Comparison & Synthesis</h1>
          <p className="page-desc">
            Correlating Model 1 (Deposit Prospectivity Potential) with Model 2 (Operational Output Achievement) to pinpoint high-potential, high-yield assets.
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="pill-row">
        <button
          className={`pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All 10 Mines
        </button>
        <button
          className={`pill ${activeFilter === 'both' ? 'active' : ''}`}
          onClick={() => setActiveFilter('both')}
        >
          🌟 High in Both (Optimal Assets)
        </button>
        <button
          className={`pill ${activeFilter === 'prosp' ? 'active' : ''}`}
          onClick={() => setActiveFilter('prosp')}
        >
          🔵 High Prospectivity · Low Productivity (Bottlenecked)
        </button>
        <button
          className={`pill ${activeFilter === 'prod' ? 'active' : ''}`}
          onClick={() => setActiveFilter('prod')}
        >
          🟠 High Productivity · Low Prospectivity (Mature)
        </button>
        <button
          className={`pill ${activeFilter === 'low' ? 'active' : ''}`}
          onClick={() => setActiveFilter('low')}
        >
          ⚠️ Low in Both (High Risk)
        </button>
      </div>

      {/* Main Quadrant View */}
      <div className="grid-1-2" style={{ alignItems: 'start' }}>
        <div>
          {/* Mine Breakdown Summary List */}
          <div className="chart-card">
            <div className="chart-title" style={{ marginBottom: '14px' }}>
              <GitCompare size={16} style={{ color: 'var(--cyan)' }} />
              Active Filter: {filteredMines.length} Mines
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {filteredMines.map((m) => (
                <div
                  key={m.mine}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{m.mine}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{m.state}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 600 }}>
                      Prosp: {(m.avg_prospectivity * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 600 }}>
                      Ach: {m.avg_achievement}%
                    </div>
                  </div>
                </div>
              ))}
              {filteredMines.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)' }}>
                  No mines fall into this quadrant filter.
                </div>
              )}
            </div>
          </div>

          {/* Quadrant Strategic Guide */}
          <div className="chart-card">
            <div className="chart-title" style={{ marginBottom: '12px' }}>
              <HelpCircle size={16} style={{ color: 'var(--purple)' }} />
              Strategic Quadrant Interpretation
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.8' }}>
              <div>
                🌟 <b style={{ color: 'var(--green)' }}>Top-Right (High Prosp + High Ach)</b>:
                Tier-1 core assets with strong geological reserves and efficient extraction.
              </div>
              <div style={{ marginTop: '6px' }}>
                🔵 <b style={{ color: 'var(--cyan)' }}>Top-Left (High Prosp + Low Ach)</b>:
                High geological promise hampered by equipment breakdowns or monsoon rainfall. Prime target for capex upgrade.
              </div>
              <div style={{ marginTop: '6px' }}>
                🟠 <b style={{ color: 'var(--amber)' }}>Bottom-Right (Low Prosp + High Ach)</b>:
                Mature mines with high operational discipline but approaching ore depletion.
              </div>
              <div style={{ marginTop: '6px' }}>
                ⚠️ <b style={{ color: 'var(--red)' }}>Bottom-Left (Low Prosp + Low Ach)</b>:
                High financial and operational risk. Requires remediation or phased decommissioning.
              </div>
            </div>
          </div>
        </div>

        {/* Scatter Plot */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title">
              <span className="dot" style={{ background: 'var(--cyan)' }}></span>
              Scatter Analysis: Deposit Prospectivity (X) vs. Production Achievement (Y)
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>
            Dotted lines represent median threshold baselines (45% Prospectivity, 94.5% Achievement). Hover over any node to inspect metrics.
          </p>
          <div style={{ height: '420px' }}>
            <canvas ref={scatterRef}></canvas>
          </div>
        </div>
      </div>

      {/* Cross-Model Bar Comparison */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <span className="dot" style={{ background: 'var(--purple)' }}></span>
            Mine-by-Mine Potential vs. Shortfall Frequency
          </div>
        </div>
        <div style={{ height: '230px' }}>
          <canvas ref={barRef}></canvas>
        </div>
      </div>
    </div>
  );
}

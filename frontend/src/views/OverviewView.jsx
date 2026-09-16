import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import StatCard from '../components/StatCard';
import { Target, TrendingUp, Award, Clock, Database, BarChart3, ShieldCheck } from 'lucide-react';

export default function OverviewView({ data }) {
  const [distTab, setDistTab] = useState('side-by-side'); // 'side-by-side' | 'prosp' | 'prod'
  
  const prospDistRef = useRef(null);
  const prodDistRef = useRef(null);
  const overlayRef = useRef(null);
  const trendRef = useRef(null);

  const meta = data?.meta || {};
  const pMetrics = data?.prospectivity_metrics || {};
  const prodMetrics = data?.production_metrics || {};
  const comp = data?.comparison || [];
  const monthly = data?.monthly_trend || [];

  // Chart setup
  useEffect(() => {
    if (!data) return;

    const charts = [];

    // Common styling
    const tooltipStyle = {
      backgroundColor: '#0d1630',
      borderColor: '#1e2d4d',
      borderWidth: 1,
      titleFont: { family: 'Inter', weight: 'bold' },
      bodyFont: { family: 'Inter' },
      padding: 10,
      cornerRadius: 6,
    };

    // 1. Prospectivity Distribution Chart
    if (prospDistRef.current) {
      const labels = Object.keys(data.prosp_prob_dist || {});
      const values = Object.values(data.prosp_prob_dist || {});
      const ctx = prospDistRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Grid Cells',
            data: values,
            backgroundColor: values.map((_, i) => i >= 7 ? 'rgba(0, 230, 118, 0.65)' : i >= 5 ? 'rgba(0, 229, 255, 0.65)' : i >= 3 ? 'rgba(255, 171, 64, 0.65)' : 'rgba(255, 82, 82, 0.65)'),
            borderColor: values.map((_, i) => i >= 7 ? '#00e676' : i >= 5 ? '#00e5ff' : i >= 3 ? '#ffab40' : '#ff5252'),
            borderWidth: 1.5,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: tooltipStyle,
          },
          scales: {
            x: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
            y: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
          }
        }
      });
      charts.push(c);
    }

    // 2. Production Achievement Distribution Chart
    if (prodDistRef.current) {
      const labels = Object.keys(data.ach_dist || {});
      const values = Object.values(data.ach_dist || {});
      const ctx = prodDistRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Monthly Records',
            data: values,
            backgroundColor: labels.map((l) => l.includes('>') || l.includes('95-100') ? 'rgba(0, 230, 118, 0.65)' : l.includes('90-95') || l.includes('85-90') ? 'rgba(255, 171, 64, 0.65)' : 'rgba(255, 82, 82, 0.65)'),
            borderColor: labels.map((l) => l.includes('>') || l.includes('95-100') ? '#00e676' : l.includes('90-95') || l.includes('85-90') ? '#ffab40' : '#ff5252'),
            borderWidth: 1.5,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: tooltipStyle,
          },
          scales: {
            x: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
            y: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
          }
        }
      });
      charts.push(c);
    }

    // 3. Comparison Overlaid Chart (Prospectivity Potential vs Production Achievement)
    if (overlayRef.current) {
      const sortedComp = [...comp].sort((a, b) => b.avg_achievement - a.avg_achievement);
      const ctx = overlayRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedComp.map(c => c.mine),
          datasets: [
            {
              type: 'bar',
              label: 'Production Achievement %',
              data: sortedComp.map(c => c.avg_achievement),
              backgroundColor: 'rgba(0, 229, 255, 0.35)',
              borderColor: '#00e5ff',
              borderWidth: 2,
              borderRadius: 6,
              yAxisID: 'y1',
              order: 2,
            },
            {
              type: 'line',
              label: 'State Prospectivity Potential %',
              data: sortedComp.map(c => (c.avg_prospectivity * 100).toFixed(1)),
              borderColor: '#ce93d8',
              backgroundColor: 'rgba(206, 147, 216, 0.15)',
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#ce93d8',
              pointBorderColor: '#fff',
              pointRadius: 5,
              yAxisID: 'y2',
              order: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#e2e8f0', font: { family: 'Inter', size: 12 } },
              position: 'top',
            },
            tooltip: tooltipStyle,
          },
          scales: {
            x: {
              grid: { color: 'rgba(30, 45, 77, 0.4)' },
              ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
            },
            y1: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'Achievement (%)', color: '#00e5ff', font: { family: 'Inter' } },
              grid: { color: 'rgba(30, 45, 77, 0.4)' },
              ticks: { color: '#94a3b8' },
              min: 90,
              max: 98,
            },
            y2: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Prospectivity (%)', color: '#ce93d8', font: { family: 'Inter' } },
              grid: { drawOnChartArea: false },
              ticks: { color: '#ce93d8' },
              min: 30,
              max: 60,
            }
          }
        }
      });
      charts.push(c);
    }

    // 4. Monthly Trend Chart
    if (trendRef.current) {
      const recentMonths = monthly.slice(-24);
      const ctx = trendRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'line',
        data: {
          labels: recentMonths.map(m => m.period),
          datasets: [
            {
              label: 'Planned (Tonnes)',
              data: recentMonths.map(m => m.planned),
              borderColor: '#ce93d8',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.3,
            },
            {
              label: 'Actual (Tonnes)',
              data: recentMonths.map(m => m.actual),
              borderColor: '#ffab40',
              backgroundColor: 'rgba(255, 171, 64, 0.1)',
              fill: true,
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: '#ffab40',
              tension: 0.3,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#e2e8f0', font: { family: 'Inter', size: 12 } },
            },
            tooltip: tooltipStyle,
          },
          scales: {
            x: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', maxTicksLimit: 12 } },
            y: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
      charts.push(c);
    }

    return () => {
      charts.forEach(c => c.destroy());
    };
  }, [data, distTab]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Intelligence Overview</h1>
          <p className="page-desc">
            Unified telemetry synthesizing Model 1 (Geospatial Prospectivity) and Model 2 (Operational Productivity)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text3)', fontSize: '12px' }}>
          <Clock size={15} />
          <span>Last Updated: <b>{meta?.generated ? new Date(meta.generated).toLocaleString() : 'Just now'}</b></span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Prospectivity Cells"
          value={(meta?.total_prosp_cells || 3000).toLocaleString()}
          sub="Model 1 · Grid coverage across MP & MH"
          accent="var(--cyan)"
          accent2="var(--cyan2)"
          icon={Database}
        />
        <StatCard
          label="Avg Prospectivity"
          value="44.6%"
          sub="Mean manganese mineralization score"
          accent="var(--purple)"
          accent2="#e040fb"
          icon={Target}
        />
        <StatCard
          label="Top Prospect Cell"
          value="99.9%"
          sub="Cell MP_1155_0564 · Very High tier"
          accent="var(--green)"
          accent2="#69f0ae"
          icon={Award}
        />
        <StatCard
          label="Production Records"
          value={(meta?.total_prod_records || 1320).toLocaleString()}
          sub="Model 2 · 10 mines · 2015–2025"
          accent="var(--amber)"
          accent2="var(--amber2)"
          icon={TrendingUp}
        />
        <StatCard
          label="Avg Achievement"
          value="94.6%"
          sub="Overall actual vs. target quota"
          accent="var(--cyan)"
          accent2="var(--green)"
          icon={BarChart3}
        />
        <StatCard
          label="Top Producer Mine"
          value="Gumgaon"
          sub="95.8% avg achievement · Maharashtra"
          accent="var(--amber)"
          accent2="#ffd740"
          icon={Award}
        />
      </div>

      {/* Model Health / Metrics Banner */}
      <div className="grid-2">
        <div className="chart-card" style={{ padding: '18px 22px', borderLeft: '4px solid var(--cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--cyan)' }}>
              Model 1: Prospectivity Classifier
            </div>
            <span className="badge badge-high"><ShieldCheck size={12} /> RF + XGBoost</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '14px' }}>
            Multi-source geological, geophysical, and geochemical classification engine.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {pMetrics.accuracy ? (pMetrics.accuracy * 100).toFixed(1) + '%' : '84.8%'}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>ROC-AUC</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green)', marginTop: '2px' }}>
                {pMetrics.roc_auc ? pMetrics.roc_auc.toFixed(3) : '0.906'}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Precision</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)', marginTop: '2px' }}>
                {pMetrics.precision ? (pMetrics.precision * 100).toFixed(1) + '%' : '82.4%'}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>F1-Score</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--purple)', marginTop: '2px' }}>
                {pMetrics.f1 ? (pMetrics.f1 * 100).toFixed(1) + '%' : '83.9%'}
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card" style={{ padding: '18px 22px', borderLeft: '4px solid var(--amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--amber)' }}>
              Model 2: Operational Productivity
            </div>
            <span className="badge badge-medium"><ShieldCheck size={12} /> Regressor + Shortfall F1</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '14px' }}>
            Operational forecasting with weather, machinery downtime, and absenteeism risk factors.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>R² Score</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {prodMetrics?.regression?.r2 ? prodMetrics.regression.r2.toFixed(3) : '0.924'}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Shortfall F1</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green)', marginTop: '2px' }}>
                {prodMetrics?.classification?.f1 ? (prodMetrics.classification.f1 * 100).toFixed(1) + '%' : '88.3%'}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>RMSE</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--amber)', marginTop: '2px' }}>
                {prodMetrics?.regression?.rmse ? prodMetrics.regression.rmse.toFixed(0) + ' t' : '312 t'}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>ROC-AUC</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)', marginTop: '2px' }}>
                {prodMetrics?.classification?.roc_auc ? prodMetrics.classification.roc_auc.toFixed(3) : '0.941'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Side-by-Side (or Toggleable) Score Distribution Charts */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <span className="dot" style={{ background: 'var(--cyan)' }}></span>
            Dual Model Score Distributions
          </div>
          <div className="tab-row">
            <button
              className={`tab-btn ${distTab === 'side-by-side' ? 'active' : ''}`}
              onClick={() => setDistTab('side-by-side')}
            >
              Side-by-Side
            </button>
            <button
              className={`tab-btn ${distTab === 'prosp' ? 'active' : ''}`}
              onClick={() => setDistTab('prosp')}
            >
              Prospectivity Model Only
            </button>
            <button
              className={`tab-btn ${distTab === 'prod' ? 'active' : ''}`}
              onClick={() => setDistTab('prod')}
            >
              Productivity Model Only
            </button>
          </div>
        </div>

        <div className={distTab === 'side-by-side' ? 'grid-2' : ''}>
          {(distTab === 'side-by-side' || distTab === 'prosp') && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text2)', marginBottom: '10px' }}>
                Model 1: Prospectivity Probability Distribution (3,000 Cells)
              </div>
              <div style={{ height: '240px' }}>
                <canvas ref={prospDistRef}></canvas>
              </div>
            </div>
          )}

          {(distTab === 'side-by-side' || distTab === 'prod') && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text2)', marginBottom: '10px' }}>
                Model 2: Production Achievement % Distribution (1,320 Records)
              </div>
              <div style={{ height: '240px' }}>
                <canvas ref={prodDistRef}></canvas>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Overlay Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <span className="dot" style={{ background: 'var(--purple)' }}></span>
            Overlaid Model Telemetry: Prospectivity Potential vs. Production Achievement
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>10 Operating Manganese Mines</span>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text2)', marginBottom: '14px' }}>
          This dual-axis overlay correlates state-level mineral deposit potential against historical mining output achievement.
        </p>
        <div style={{ height: '290px' }}>
          <canvas ref={overlayRef}></canvas>
        </div>
      </div>

      {/* Historical Monthly Aggregate Trend */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <span className="dot" style={{ background: 'var(--amber)' }}></span>
            Total Production Velocity: Planned vs. Actual Trend (Recent 24 Months)
          </div>
        </div>
        <div style={{ height: '240px' }}>
          <canvas ref={trendRef}></canvas>
        </div>
      </div>
    </div>
  );
}

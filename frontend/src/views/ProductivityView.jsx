import React, { useState, useMemo, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { Search, ArrowUpDown, Filter, Eye, CloudRain, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ProductivityView({ data }) {
  const [search, setSearch] = useState('');
  const [mineFilter, setMineFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [shortfallFilter, setShortfallFilter] = useState('ALL');
  const [sortField, setSortField] = useState('year');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const PER_PAGE = 15;
  const records = data?.prod_table || [];
  const mines = data?.meta?.mines || [];
  const years = data?.meta?.years || [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

  const shortfallChartRef = useRef(null);
  const monsoonChartRef = useRef(null);

  // Filter & Sort
  const filteredRecords = useMemo(() => {
    let list = records.filter((r) => {
      const matchSearch =
        !search ||
        r.mine_name.toLowerCase().includes(search.toLowerCase()) ||
        String(r.year).includes(search) ||
        r.state.toLowerCase().includes(search.toLowerCase());

      const matchMine = mineFilter === 'ALL' || r.mine_name === mineFilter;
      const matchYear = yearFilter === 'ALL' || String(r.year) === yearFilter;
      const matchShortfall =
        shortfallFilter === 'ALL' || String(r.shortfall_flag) === shortfallFilter;

      return matchSearch && matchMine && matchYear && matchShortfall;
    });

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [records, search, mineFilter, yearFilter, shortfallFilter, sortField, sortAsc]);

  useEffect(() => {
    setPage(0);
  }, [search, mineFilter, yearFilter, shortfallFilter]);

  // Operational Charts
  useEffect(() => {
    if (!data) return;
    const charts = [];

    // 1. Mine Summary Shortfall Bar Chart
    if (shortfallChartRef.current && data.mine_summary) {
      const sortedMines = [...data.mine_summary].sort((a, b) => b.shortfall_rate - a.shortfall_rate);
      const ctx = shortfallChartRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedMines.map((m) => m.mine_name),
          datasets: [{
            label: 'Shortfall Rate (%)',
            data: sortedMines.map((m) => +(m.shortfall_rate * 100).toFixed(1)),
            backgroundColor: sortedMines.map((m) => m.shortfall_rate > 0.4 ? 'rgba(255, 82, 82, 0.7)' : 'rgba(255, 171, 64, 0.7)'),
            borderColor: sortedMines.map((m) => m.shortfall_rate > 0.4 ? '#ff5252' : '#ffab40'),
            borderWidth: 1.5,
            borderRadius: 6,
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
            }
          },
          scales: {
            x: { grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } } },
            y: { title: { display: true, text: 'Shortfall Rate (%)', color: '#94a3b8' }, grid: { color: 'rgba(30, 45, 77, 0.4)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
      charts.push(c);
    }

    // 2. Monsoon vs Non-Monsoon Impact Chart
    if (monsoonChartRef.current && data.monsoon_analysis) {
      const monData = data.monsoon_analysis.slice(0, 10);
      const ctx = monsoonChartRef.current.getContext('2d');
      const c = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monData.map((m) => m.mine_name),
          datasets: [
            {
              label: 'Avg Rainfall (mm)',
              data: monData.map((m) => m.avg_rainfall),
              backgroundColor: 'rgba(0, 229, 255, 0.5)',
              borderColor: '#00e5ff',
              borderWidth: 1.5,
              borderRadius: 4,
              yAxisID: 'yRain',
            },
            {
              label: 'Achievement %',
              data: monData.map((m) => m.avg_achievement),
              backgroundColor: 'rgba(255, 171, 64, 0.6)',
              borderColor: '#ffab40',
              borderWidth: 1.5,
              borderRadius: 4,
              yAxisID: 'yAch',
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
            yRain: { type: 'linear', position: 'left', title: { display: true, text: 'Rainfall (mm)', color: '#00e5ff' }, ticks: { color: '#00e5ff' }, grid: { color: 'rgba(30, 45, 77, 0.4)' } },
            yAch: { type: 'linear', position: 'right', min: 80, max: 100, title: { display: true, text: 'Achievement %', color: '#ffab40' }, ticks: { color: '#ffab40' }, grid: { drawOnChartArea: false } }
          }
        }
      });
      charts.push(c);
    }

    return () => charts.forEach((c) => c.destroy());
  }, [data]);

  const pagedRecords = filteredRecords.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Model 2: Operational Productivity View</h1>
          <p className="page-desc">
            Granular mine-level output tracking, shortfall classification, machine downtime, and environmental risk diagnostics.
          </p>
        </div>
      </div>

      {/* Operational Analytics Cards */}
      <div className="grid-2">
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title">
              <span className="dot" style={{ background: 'var(--red)' }}></span>
              Shortfall Probability Rate by Mine (%)
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <canvas ref={shortfallChartRef}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title">
              <span className="dot" style={{ background: 'var(--cyan)' }}></span>
              Monsoon Impact Diagnostics: Rainfall vs. Target Achievement
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <canvas ref={monsoonChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="chart-card" style={{ padding: '18px 20px' }}>
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by mine name, state..."
              className="input-search"
              style={{ width: '100%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={mineFilter}
            onChange={(e) => setMineFilter(e.target.value)}
          >
            <option value="ALL">All Mines ({mines.length})</option>
            {mines.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            className="select-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="ALL">All Years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>

          <select
            className="select-filter"
            value={shortfallFilter}
            onChange={(e) => setShortfallFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="1">Shortfall Only</option>
            <option value="0">On Target Only</option>
          </select>

          <div style={{ color: 'var(--text3)', fontSize: '12px', marginLeft: 'auto' }}>
            Showing <b>{filteredRecords.length.toLocaleString()}</b> records
          </div>
        </div>

        {/* Results Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('mine_name')}>
                  Mine Name <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('year')}>
                  Period <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('planned_production_tonnes')}>
                  Planned (t) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('actual_production_tonnes')}>
                  Actual (t) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('shortfall_tonnes')}>
                  Shortfall (t) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('production_achievement_pct')}>
                  Achievement <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('shortfall_flag')}>
                  Risk Status <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRecords.map((r, idx) => (
                <tr key={`${r.mine_name}-${r.year}-${r.month}-${idx}`} onClick={() => setSelectedRecord(r)}>
                  <td>
                    <b style={{ color: '#fff' }}>{r.mine_name}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{r.state}</div>
                  </td>
                  <td>
                    {MONTH_NAMES[r.month]} {r.year}
                  </td>
                  <td>{r.planned_production_tonnes?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                  <td style={{ color: 'var(--amber)', fontWeight: 600 }}>
                    {r.actual_production_tonnes?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </td>
                  <td style={{ color: r.shortfall_tonnes > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
                    {r.shortfall_tonnes?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color:
                          r.production_achievement_pct >= 95
                            ? 'var(--green)'
                            : r.production_achievement_pct >= 90
                            ? 'var(--amber)'
                            : 'var(--red)',
                      }}
                    >
                      {r.production_achievement_pct?.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    {r.shortfall_flag ? (
                      <span className="badge badge-flag">
                        <AlertTriangle size={10} /> SHORTFALL
                      </span>
                    ) : (
                      <span className="badge badge-ok">
                        <CheckCircle size={10} /> ON TARGET
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="pg-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(r);
                      }}
                    >
                      <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {pagedRecords.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text3)' }}>
                    No production events found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          total={filteredRecords.length}
          perPage={PER_PAGE}
          current={page}
          onChange={(p) => setPage(p)}
        />
      </div>

      {/* Production Event Detail Modal */}
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `⛏ ${selectedRecord.mine_name} — ${MONTH_NAMES[selectedRecord.month]} ${selectedRecord.year}` : ''}
        subtitle={selectedRecord ? `${selectedRecord.state} · Output Performance Log` : ''}
      >
        {selectedRecord && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg2)',
                padding: '16px 20px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid var(--card-border)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase' }}>
                  Target Achievement
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: selectedRecord.production_achievement_pct >= 95 ? 'var(--green)' : 'var(--amber)',
                  }}
                >
                  {selectedRecord.production_achievement_pct?.toFixed(2)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Status
                </div>
                {selectedRecord.shortfall_flag ? (
                  <span className="badge badge-flag"><AlertTriangle size={11} /> PRODUCTION SHORTFALL</span>
                ) : (
                  <span className="badge badge-ok"><CheckCircle size={11} /> TARGET ACHIEVED</span>
                )}
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="k">Planned Production</div>
                <div className="v" style={{ color: 'var(--purple)' }}>
                  {selectedRecord.planned_production_tonnes?.toLocaleString()} t
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Actual Production</div>
                <div className="v" style={{ color: 'var(--amber)' }}>
                  {selectedRecord.actual_production_tonnes?.toLocaleString()} t
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Shortfall Loss</div>
                <div className="v" style={{ color: selectedRecord.shortfall_tonnes > 0 ? 'var(--red)' : 'var(--green)' }}>
                  {selectedRecord.shortfall_tonnes?.toLocaleString()} t
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Equipment Downtime</div>
                <div className="v" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={14} style={{ color: 'var(--text3)' }} />
                  {selectedRecord.equipment_downtime_hours} hrs
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Major Breakdowns</div>
                <div className="v">{selectedRecord.breakdown_count} incidents</div>
              </div>
              <div className="detail-item">
                <div className="k">Precipitation / Rainfall</div>
                <div className="v" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudRain size={14} style={{ color: 'var(--cyan)' }} />
                  {selectedRecord.rainfall_mm} mm
                </div>
              </div>
              <div className="detail-item">
                <div className="k">Workforce Absenteeism</div>
                <div className="v">{selectedRecord.absenteeism_pct}%</div>
              </div>
              <div className="detail-item">
                <div className="k">Monsoon Season Flag</div>
                <div className="v">
                  {selectedRecord.is_monsoon_season_flag ? (
                    <span className="badge badge-flag">Active Monsoon</span>
                  ) : (
                    <span className="badge badge-ok">Dry Season</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

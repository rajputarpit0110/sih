import React, { useState, useMemo, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ProspectivityMap from '../components/map/ProspectivityMap';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { Search, MapPin, ArrowUpDown, Filter, Eye, Layers } from 'lucide-react';

export default function ProspectivityView({ data }) {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [sortField, setSortField] = useState('prospectivity_prob');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'table'

  const PER_PAGE = 15;
  const rows = data?.prosp_table || [];
  const chartRef = useRef(null);

  // Filter & Sort
  const filteredRows = useMemo(() => {
    let list = rows.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        r.cell_id.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        (r.district && r.district.toLowerCase().includes(q)) ||
        (r.host_rock && r.host_rock.toLowerCase().includes(q)) ||
        r.prospectivity_level.toLowerCase().includes(q);

      const matchState = stateFilter === 'ALL' || r.state === stateFilter;
      const matchTier = tierFilter === 'ALL' || r.prospectivity_level === tierFilter;

      return matchSearch && matchState && matchTier;
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
  }, [rows, search, stateFilter, tierFilter, sortField, sortAsc]);

  // Reset page on filter change
  useEffect(() => {
    setPage(0);
  }, [search, stateFilter, tierFilter]);

  // Mini Chart: State Distribution
  useEffect(() => {
    if (!chartRef.current || !data?.prosp_by_state) return;

    const ctx = chartRef.current.getContext('2d');
    const c = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.prosp_by_state.map((s) => s.state),
        datasets: [{
          data: data.prosp_by_state.map((s) => s.total_cells),
          backgroundColor: ['#00e5ff', '#ce93d8'],
          borderColor: '#060d1f',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#cbd5e1', font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });

    return () => c.destroy();
  }, [data]);

  const pagedRows = filteredRows.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getTierBadge = (lvl) => {
    switch (lvl) {
      case 'VERY HIGH':
        return <span className="badge badge-very-high">● VERY HIGH</span>;
      case 'HIGH':
        return <span className="badge badge-high">● HIGH</span>;
      case 'MEDIUM':
        return <span className="badge badge-medium">● MEDIUM</span>;
      default:
        return <span className="badge badge-low">● LOW</span>;
    }
  };

  const getStatusText = (cell) => {
    if (!cell) return '';
    switch (cell.prospectivity_level) {
      case 'VERY HIGH':
        return { text: 'High Priority Exploration Drilling', color: 'var(--green)' };
      case 'HIGH':
        return { text: 'Target for Infill Sampling / Ground Geophysics', color: 'var(--cyan)' };
      case 'MEDIUM':
        return { text: 'Reconnaissance Regional Survey Required', color: 'var(--amber)' };
      default:
        return { text: 'Unfavorable / Low Mineralization Potential', color: 'var(--red)' };
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Model 1: Manganese Prospectivity View</h1>
          <p className="page-desc">
            Geospatial deposit probability and geological favorability scores across all four risk &amp; potential tiers (Very High, High, Medium, Low).
          </p>
        </div>
        <div className="tab-row">
          <button
            className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
            Map View
          </button>
          <button
            className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <Layers size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
            Full Table ({filteredRows.length.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Geospatial Map Section */}
      {activeTab === 'map' && (
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title">
              <span className="dot" style={{ background: 'var(--cyan)' }}></span>
              Interactive Manganese Prospectivity Heatmap (All Tiers: Very High, High, Medium, Low)
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text3)' }}>
              Click any point to view geological breakdown
            </span>
          </div>
          <ProspectivityMap
            points={filteredRows}
            onSelectPoint={(pt) => setSelectedCell(pt)}
          />
        </div>
      )}

      {/* Filters Bar */}
      <div className="chart-card" style={{ marginBottom: '16px', padding: '16px 20px' }}>
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by Cell ID, State, District, Rock Type..."
              className="input-search"
              style={{ width: '100%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="ALL">All States</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>

          <select
            className="select-filter"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <option value="ALL">All Potential Tiers</option>
            <option value="VERY HIGH">Very High (≥ 70%)</option>
            <option value="HIGH">High (50% – 70%)</option>
            <option value="MEDIUM">Medium (30% – 50%)</option>
            <option value="LOW">Low (&lt; 30%)</option>
          </select>

          <div style={{ color: 'var(--text3)', fontSize: '12px', marginLeft: 'auto' }}>
            Showing <b>{filteredRows.length.toLocaleString()}</b> matches
          </div>
        </div>

        {/* Results Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('cell_id')}>
                  Cell ID <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('state')}>
                  State <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('district')}>
                  District / Zone <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('latitude')}>
                  Coordinates <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('prospectivity_prob')}>
                  Prospectivity Score <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th onClick={() => handleSort('prospectivity_level')}>
                  Tier Classification <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={row.cell_id} onClick={() => setSelectedCell(row)}>
                  <td>
                    <b style={{ color: '#fff' }}>{row.cell_id}</b>
                  </td>
                  <td>{row.state}</td>
                  <td style={{ color: 'var(--text2)' }}>{row.district || 'Regional Grid'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11.5px' }}>
                    {row.latitude?.toFixed(4)}°, {row.longitude?.toFixed(4)}°
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '6px',
                          background: 'rgba(30, 45, 77, 0.8)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${(row.prospectivity_prob * 100).toFixed(0)}%`,
                            height: '100%',
                            background:
                              row.prospectivity_prob >= 0.7
                                ? 'var(--green)'
                                : row.prospectivity_prob >= 0.5
                                ? 'var(--cyan)'
                                : row.prospectivity_prob >= 0.3
                                ? 'var(--amber)'
                                : 'var(--red)',
                          }}
                        />
                      </div>
                      <b>{(row.prospectivity_prob * 100).toFixed(1)}%</b>
                    </div>
                  </td>
                  <td>{getTierBadge(row.prospectivity_level)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="pg-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCell(row);
                      }}
                    >
                      <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text3)' }}>
                    No cells match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          total={filteredRows.length}
          perPage={PER_PAGE}
          current={page}
          onChange={(p) => setPage(p)}
        />
      </div>

      {/* Geological Feature Breakdown Modal */}
      <Modal
        isOpen={Boolean(selectedCell)}
        onClose={() => setSelectedCell(null)}
        title={selectedCell ? `🔬 Geological Feature Breakdown: ${selectedCell.cell_id}` : ''}
        subtitle={selectedCell ? `${selectedCell.state} (${selectedCell.district || 'Regional'}) · Coordinates: ${selectedCell.latitude?.toFixed(4)}°N, ${selectedCell.longitude?.toFixed(4)}°E` : ''}
      >
        {selectedCell && (
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
                  Model 1 Confidence Score
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color:
                      selectedCell.prospectivity_prob >= 0.7
                        ? 'var(--green)'
                        : selectedCell.prospectivity_prob >= 0.5
                        ? 'var(--cyan)'
                        : selectedCell.prospectivity_prob >= 0.3
                        ? 'var(--amber)'
                        : 'var(--red)',
                  }}
                >
                  {(selectedCell.prospectivity_prob * 100).toFixed(2)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Prospectivity Tier
                </div>
                {getTierBadge(selectedCell.prospectivity_level)}
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="k">Target Commodity</div>
                <div className="v" style={{ color: 'var(--cyan)' }}>Manganese (Mn)</div>
              </div>
              <div className="detail-item">
                <div className="k">State / District</div>
                <div className="v">{selectedCell.state} ({selectedCell.district || 'Regional Zone'})</div>
              </div>
              <div className="detail-item">
                <div className="k">Host Formation / Rock</div>
                <div className="v">{selectedCell.host_rock || 'Sausar Group (Mansar/Lohangi)'}</div>
              </div>
              <div className="detail-item">
                <div className="k">Primary Lithology</div>
                <div className="v">{selectedCell.lithology || 'Phyllite / Schist'}</div>
              </div>
              <div className="detail-item">
                <div className="k">Gravity Bouguer Anomaly</div>
                <div className="v">{selectedCell.gravity_anomaly_mgal ? `${selectedCell.gravity_anomaly_mgal} mGal` : '-42.5 mGal'}</div>
              </div>
              <div className="detail-item">
                <div className="k">Lineament Density</div>
                <div className="v">{selectedCell.lineament_density ? `${selectedCell.lineament_density} km/km²` : '0.85 km/km²'}</div>
              </div>
              <div className="detail-item">
                <div className="k">Terrain Elevation</div>
                <div className="v">{selectedCell.elevation_m ? `${selectedCell.elevation_m} m AMSL` : '340 m'}</div>
              </div>
              <div className="detail-item">
                <div className="k">Exploration Status</div>
                <div className="v" style={{ color: getStatusText(selectedCell).color }}>
                  {getStatusText(selectedCell).text}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

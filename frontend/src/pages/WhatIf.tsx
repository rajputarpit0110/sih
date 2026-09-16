import React, { useState, useEffect } from 'react';
import { fetchMines } from '../api/exploration';
import { runWhatIfSimulation } from '../api/production';
import type { MineLocation } from '../types/exploration';
import type { ProductionConditions, WhatIfSimulationResult } from '../types/production';
import { formatTonnes } from '../lib/utils';
import { Play, AlertCircle, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhatIf: React.FC = () => {
  const [mines, setMines] = useState<MineLocation[]>([]);
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);

  const [baseline, setBaseline] = useState<ProductionConditions>({
    mine_id: 'MOIL-07',
    mine_name: 'Balaghat',
    production_target_tonnes: 22000,
    equipment_available_count: 24,
    equipment_operating_count: 20,
    equipment_downtime_hours: 24.0,
    planned_blasts: 14,
    completed_blasts: 11,
    blast_delay_hours: 8.0,
    transport_delay_hours: 5.0,
    rainfall_mm: 35.0,
    working_hours: 240.0,
  });

  const [scenario, setScenario] = useState<ProductionConditions>({
    mine_id: 'MOIL-07',
    mine_name: 'Balaghat',
    production_target_tonnes: 22000,
    equipment_available_count: 24,
    equipment_operating_count: 23,
    equipment_downtime_hours: 6.0,
    planned_blasts: 14,
    completed_blasts: 14,
    blast_delay_hours: 0.0,
    transport_delay_hours: 1.0,
    rainfall_mm: 35.0,
    working_hours: 240.0,
  });

  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMines() {
      try {
        const list = await fetchMines();
        setMines(list);
        if (list.length > 0) {
          setSelectedMine(list[0]);
        }
      } catch (err) {
        console.error('Error loading mines:', err);
      }
    }
    loadMines();
  }, []);

  const handleMineChange = (mineId: string) => {
    const m = mines.find((mine) => mine.mine_id === mineId);
    if (!m) return;
    setSelectedMine(m);
    setBaseline((prev) => ({
      ...prev,
      mine_id: m.mine_id,
      mine_name: m.mine_name,
      production_target_tonnes: m.avg_target_tonnes,
      equipment_available_count: m.default_equipment_available,
      equipment_operating_count: m.default_equipment_operating,
    }));
    setScenario((prev) => ({
      ...prev,
      mine_id: m.mine_id,
      mine_name: m.mine_name,
      production_target_tonnes: m.avg_target_tonnes,
      equipment_available_count: m.default_equipment_available,
      equipment_operating_count: m.default_equipment_operating,
    }));
    setSimulationResult(null);
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await runWhatIfSimulation(baseline, scenario);
      setSimulationResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Simulation failed. Check backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f8fafc] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="mx-auto max-w-7xl border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Scenario analysis & counterfactual simulation
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Compare model-estimated outputs under alternative operational interventions.
          </p>
        </div>

        {/* Mine Asset Picker */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Operating asset:</span>
          <select
            value={selectedMine?.mine_id || 'MOIL-07'}
            onChange={(e) => handleMineChange(e.target.value)}
            className="rounded border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-[#c26d3a] focus:outline-none shadow-xs"
          >
            {mines.map((m) => (
              <option key={m.mine_id} value={m.mine_id}>
                {m.mine_name} ({m.mine_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Scenario Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-100/80 p-3 rounded-lg border border-slate-200">
          <span className="text-slate-700 font-medium">Quick load counterfactual scenario:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setScenario({
                  ...baseline,
                  equipment_downtime_hours: Math.max(2, (baseline.equipment_downtime_hours || 24) - 18),
                  equipment_operating_count: (baseline.equipment_operating_count || 18) + 3,
                  maintenance_hours: Math.max(10, (baseline.maintenance_hours || 35) - 15),
                });
              }}
              className="px-2.5 py-1 rounded bg-white hover:bg-orange-50 text-slate-700 hover:text-[#c26d3a] border border-slate-200 transition font-medium cursor-pointer shadow-2xs"
            >
              ⚡ Fleet Optimization (-18h Downtime)
            </button>
            <button
              type="button"
              onClick={() => {
                setScenario({
                  ...baseline,
                  rainfall_mm: (baseline.rainfall_mm || 15) + 35,
                  blast_delay_hours: (baseline.blast_delay_hours || 0) + 6,
                  transport_delay_hours: (baseline.transport_delay_hours || 2) + 4,
                });
              }}
              className="px-2.5 py-1 rounded bg-white hover:bg-orange-50 text-slate-700 hover:text-[#c26d3a] border border-slate-200 transition font-medium cursor-pointer shadow-2xs"
            >
              🌧️ Monsoon Disruption (+35mm Rain)
            </button>
            <button
              type="button"
              onClick={() => {
                setScenario({
                  ...baseline,
                  ore_grade_pct: Math.min(52, (baseline.ore_grade_pct || 42) + 3.5),
                  active_faces: (baseline.active_faces || 6) + 2,
                });
              }}
              className="px-2.5 py-1 rounded bg-white hover:bg-orange-50 text-slate-700 hover:text-[#c26d3a] border border-slate-200 transition font-medium cursor-pointer shadow-2xs"
            >
              💎 Grade Maximization (+3.5% Ore Grade)
            </button>
          </div>
        </div>

        {/* Side-by-Side Simulation Workbench Table */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 text-xs sm:text-sm">
            <div className="md:col-span-4 p-4 text-slate-700 font-semibold bg-slate-50">
              Operational lever
            </div>
            <div className="md:col-span-4 p-4 text-slate-700 font-semibold bg-slate-50/70 border-l border-slate-200">
              Baseline (current reference)
            </div>
            <div className="md:col-span-4 p-4 text-[#c26d3a] font-semibold bg-orange-50/50 border-l border-slate-200">
              Counterfactual scenario
            </div>
          </div>

          <div className="divide-y divide-slate-200 text-xs sm:text-sm">
            {/* Lever 1: Equipment Downtime */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-center p-3.5">
              <div className="md:col-span-4 text-slate-900 font-semibold text-sm sm:text-base">
                Equipment downtime
                <span className="block text-xs text-slate-500 font-normal">Unscheduled maintenance hours</span>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={baseline.equipment_downtime_hours ?? 24}
                    onChange={(e) => setBaseline({ ...baseline, equipment_downtime_hours: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 font-medium"
                  />
                  <span className="text-slate-500 font-normal">h</span>
                </div>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={scenario.equipment_downtime_hours ?? 6}
                    onChange={(e) => setScenario({ ...scenario, equipment_downtime_hours: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-orange-300 bg-orange-50/40 px-3 py-1.5 text-sm text-slate-900 font-medium focus:border-[#c26d3a]"
                  />
                  <span className="text-[#c26d3a] font-medium">h</span>
                  <span className="text-xs text-emerald-700 font-mono font-medium">
                    (-{(baseline.equipment_downtime_hours ?? 24) - (scenario.equipment_downtime_hours ?? 6)}h)
                  </span>
                </div>
              </div>
            </div>

            {/* Lever 2: Operating Fleet */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-center p-3.5">
              <div className="md:col-span-4 text-slate-900 font-semibold text-sm sm:text-base">
                Active fleet operating
                <span className="block text-xs text-slate-500 font-normal">LHDs, dumpers, drills deployed</span>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={baseline.equipment_operating_count ?? 20}
                    onChange={(e) => setBaseline({ ...baseline, equipment_operating_count: parseInt(e.target.value) || 0 })}
                    className="w-28 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 font-medium"
                  />
                  <span className="text-slate-500 font-normal">units</span>
                </div>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={scenario.equipment_operating_count ?? 23}
                    onChange={(e) => setScenario({ ...scenario, equipment_operating_count: parseInt(e.target.value) || 0 })}
                    className="w-28 rounded border border-orange-300 bg-orange-50/40 px-3 py-1.5 text-sm text-slate-900 font-medium focus:border-[#c26d3a]"
                  />
                  <span className="text-[#c26d3a] font-medium">units</span>
                  <span className="text-xs text-emerald-700 font-mono font-medium">
                    (+{(scenario.equipment_operating_count ?? 23) - (baseline.equipment_operating_count ?? 20)})
                  </span>
                </div>
              </div>
            </div>

            {/* Lever 3: Blasting Delay */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-center p-3.5">
              <div className="md:col-span-4 text-slate-900 font-semibold text-sm sm:text-base">
                Blasting cycle delay
                <span className="block text-xs text-slate-500 font-normal">Cumulative round delays</span>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={baseline.blast_delay_hours ?? 8}
                    onChange={(e) => setBaseline({ ...baseline, blast_delay_hours: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 font-medium"
                  />
                  <span className="text-slate-500 font-normal">h</span>
                </div>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={scenario.blast_delay_hours ?? 0}
                    onChange={(e) => setScenario({ ...scenario, blast_delay_hours: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-orange-300 bg-orange-50/40 px-3 py-1.5 text-sm text-slate-900 font-medium focus:border-[#c26d3a]"
                  />
                  <span className="text-[#c26d3a] font-medium">h</span>
                  <span className="text-xs text-emerald-700 font-mono font-medium">
                    (-{(baseline.blast_delay_hours ?? 8) - (scenario.blast_delay_hours ?? 0)}h)
                  </span>
                </div>
              </div>
            </div>

            {/* Lever 4: Transport Delay */}
            <div className="grid grid-cols-1 md:grid-cols-12 items-center p-3.5">
              <div className="md:col-span-4 text-slate-900 font-semibold text-sm sm:text-base">
                Haulage / transport delay
                <span className="block text-xs text-slate-500 font-normal">Shaft winding and chute bottlenecks</span>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={baseline.transport_delay_hours ?? 5}
                    onChange={(e) => setBaseline({ ...baseline, transport_delay_hours: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 font-medium"
                  />
                  <span className="text-slate-500 font-normal">h</span>
                </div>
              </div>
              <div className="md:col-span-4 pl-0 md:pl-3 pt-2 md:pt-0 border-l-0 md:border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={scenario.transport_delay_hours ?? 1}
                    onChange={(e) => setScenario({ ...scenario, transport_delay_hours: parseFloat(e.target.value) || 0 })}
                    className="w-28 rounded border border-orange-300 bg-orange-50/40 px-3 py-1.5 text-sm text-slate-900 font-medium focus:border-[#c26d3a]"
                  />
                  <span className="text-[#c26d3a] font-medium">h</span>
                  <span className="text-xs text-emerald-700 font-mono font-medium">
                    (-{(baseline.transport_delay_hours ?? 5) - (scenario.transport_delay_hours ?? 1)}h)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="flex items-center space-x-2 rounded bg-[#c26d3a] hover:bg-[#b45309] text-white px-6 py-3 font-semibold text-sm tracking-wide transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{isLoading ? 'Running dual model simulation...' : 'Execute counterfactual simulation'}</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-start space-x-2 rounded border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Simulation failed</span>
              <span className="text-xs">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Simulation Output: Model-Estimated Difference */}
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Model output comparison
                </span>
                <h2 className="text-base font-semibold text-slate-900 mt-0.5">
                  Simulated production delta
                </h2>
              </div>
              <span className="text-xs text-slate-600 font-medium">
                Target: <span className="font-mono">{formatTonnes(simulationResult.baseline.target_production_tonnes)}</span>
              </span>
            </div>

            {/* Central Comparative Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded border border-slate-200 bg-slate-50 p-4 text-center">
                <span className="text-xs text-slate-500 block mb-1 font-medium">Baseline output</span>
                <div className="text-3xl font-semibold text-slate-900">
                  {formatTonnes(simulationResult.baseline.expected_production_tonnes)}
                </div>
                <div className="text-xs text-slate-600 mt-1.5 font-normal">
                  Risk: <span className="font-mono font-medium">{simulationResult.baseline.risk_level.toLowerCase()} ({simulationResult.baseline.achievement_probability}%)</span>
                </div>
              </div>

              <div className="rounded border border-orange-200 bg-orange-50/50 p-4 text-center">
                <span className="text-xs text-[#c26d3a] block mb-1 font-medium">Scenario output</span>
                <div className="text-3xl font-semibold text-[#c26d3a]">
                  {formatTonnes(simulationResult.scenario.expected_production_tonnes)}
                </div>
                <div className="text-xs text-slate-600 mt-1.5 font-normal">
                  Risk: <span className="font-mono font-medium">{simulationResult.scenario.risk_level.toLowerCase()} ({simulationResult.scenario.achievement_probability}%)</span>
                </div>
              </div>

              <div className="rounded border border-emerald-200 bg-emerald-50/50 p-4 text-center">
                <span className="text-xs text-emerald-800 block mb-1 font-medium">Model delta</span>
                <div className="text-3xl font-semibold text-emerald-700">
                  {simulationResult.deltas.expected_production_change_tonnes >= 0 ? '+' : ''}
                  {formatTonnes(simulationResult.deltas.expected_production_change_tonnes)}
                </div>
                <div className="text-xs text-slate-600 mt-1.5 font-normal">
                  <span className="font-mono font-medium">{simulationResult.deltas.achievement_probability_change_pct >= 0 ? '+' : ''}{simulationResult.deltas.achievement_probability_change_pct}%</span> achievement probability shift
                </div>
              </div>
            </div>

            {/* Evaluation Commentary */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">
              <span className="font-semibold text-slate-900 mr-1.5">Engineering assessment:</span>
              <span>{simulationResult.model_statement}</span>
            </div>
          </motion.div>
        )}

        {/* Empty State Guidance Card when no simulation executed yet */}
        {!simulationResult && !isLoading && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 space-y-4 shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[#c26d3a] border border-orange-200/80">
              <Layers className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-slate-900 font-semibold text-base">
                Ready for counterfactual model evaluation
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Adjust operational levers in the counterfactual scenario column above or select one of the quick scenario presets, then execute the simulation to observe output tonnage deltas and risk probability shifts.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunSimulation}
                className="inline-flex items-center space-x-2 rounded-md bg-[#c26d3a] hover:bg-[#b45309] text-white px-5 py-2.5 text-xs font-semibold tracking-wide transition shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Simulate default scenario delta</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

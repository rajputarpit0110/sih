import React, { useState, useEffect } from 'react';
import { MineSelector } from '../components/production/MineSelector';
import { ProductionConditionForm } from '../components/production/ProductionConditionForm';
import { ProductionResultCard } from '../components/production/ProductionResultCard';
import { fetchMines } from '../api/exploration';
import { predictProduction } from '../api/production';
import type { MineLocation } from '../types/exploration';
import type { ProductionConditions, ProductionPredictionResult } from '../types/production';
import { AlertCircle, Sliders } from 'lucide-react';

export const Production: React.FC = () => {
  const [mines, setMines] = useState<MineLocation[]>([]);
  const [selectedMine, setSelectedMine] = useState<MineLocation | null>(null);
  const [conditions, setConditions] = useState<ProductionConditions>({
    mine_id: 'MOIL-07',
    mine_name: 'Balaghat',
    production_target_tonnes: 22000,
    working_hours: 240,
    shift_hours: 8,
    equipment_available_count: 24,
    equipment_operating_count: 22,
    equipment_downtime_hours: 12,
    maintenance_hours: 45,
    breakdown_count: 1,
    planned_blasts: 14,
    completed_blasts: 13,
    blast_delay_hours: 0,
    active_faces: 8,
    ore_grade_pct: 44.5,
    ore_tonnage_available: 35000,
    rainfall_mm: 24.5,
    temperature_c: 28.0,
    power_outage_hours: 3.0,
    transport_delay_hours: 1.5,
    ventilation_delay_hours: 2.0,
    manpower_available: 920,
    month: 10,
  });

  const [result, setResult] = useState<ProductionPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const mineList = await fetchMines();
        setMines(mineList);
        if (mineList.length > 0) {
          const defaultMine = mineList[0]; // Balaghat
          setSelectedMine(defaultMine);
          updateMineBaseline(defaultMine);
        }
      } catch (err: any) {
        console.error('Failed to load mine catalog:', err);
      }
    }
    loadInitialData();
  }, []);

  const updateMineBaseline = (mine: MineLocation) => {
    setSelectedMine(mine);
    setConditions((prev) => ({
      ...prev,
      mine_id: mine.mine_id,
      mine_name: mine.mine_name,
      production_target_tonnes: mine.avg_target_tonnes,
      equipment_available_count: mine.default_equipment_available,
      equipment_operating_count: mine.default_equipment_operating,
      mine_depth_m: mine.mine_depth_m,
      active_faces: mine.active_faces,
      ore_grade_pct: mine.default_ore_grade,
      manpower_available: mine.default_manpower,
      ore_tonnage_available: Math.round(mine.avg_target_tonnes * 1.6),
    }));
    setResult(null);
  };

  const handleRunPrediction = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const pred = await predictProduction(conditions);
      setResult(pred);
    } catch (err: any) {
      setErrorMessage(err.message || 'Evaluation failed. Verify backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f8fafc] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Workspace Header & Central Decision Narrative */}
      <div className="mx-auto max-w-7xl border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Production planning decision workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Can this mine achieve the selected production target under current operating conditions?
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          XGBoost Dual Inference Pipeline • SHAP Attribution
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Compact Mine Asset Strip */}
        <MineSelector
          mines={mines}
          selectedMine={selectedMine}
          onSelectMine={updateMineBaseline}
        />

        {/* Workspace Layout: Left Operational Input (7 cols) / Right Decision Output (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Operating Conditions Form */}
          <div className="lg:col-span-6 space-y-4">
            <ProductionConditionForm
              conditions={conditions}
              onChange={setConditions}
              onSubmit={handleRunPrediction}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Feasibility Decision & Recommendations */}
          <div className="lg:col-span-6 space-y-4">
            {errorMessage && (
              <div className="flex items-start space-x-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Execution Failed</span>
                  <span className="text-xs">{errorMessage}</span>
                </div>
              </div>
            )}

            {result ? (
              <ProductionResultCard result={result} />
            ) : (
              <div className="rounded border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 space-y-2 shadow-xs">
                <Sliders className="h-6 w-6 mx-auto text-slate-400" />
                <div className="text-slate-800 font-semibold text-sm">
                  Ready to evaluate target feasibility
                </div>
                <p className="max-w-md mx-auto text-xs leading-relaxed text-slate-500 font-normal">
                  Select a mine asset, specify the target tonnage for the upcoming cycle, adjust operating levers if needed, and execute the evaluation to simulate shortfall risk and generate operational response recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { ProductionConditions } from '../../types/production';
import { ChevronDown, ChevronUp, Play, Wrench, Flame, Pickaxe, Truck, CloudSun, Clock } from 'lucide-react';

interface ProductionConditionFormProps {
  conditions: ProductionConditions;
  onChange: (updated: ProductionConditions) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ProductionConditionForm: React.FC<ProductionConditionFormProps> = ({
  conditions,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [openSection, setOpenSection] = useState<string>('equipment');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const updateField = (field: keyof ProductionConditions, val: any) => {
    onChange({
      ...conditions,
      [field]: val,
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-4">
      {/* Visual Hero Focus: Production Target & Period */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Production Target & Cycle
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Monthly baseline extraction threshold
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#c26d3a] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
            MOIL Metric Tonnes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] text-slate-700 font-semibold">
                Target Output (Tonnes)
              </label>
              <div className="flex items-center space-x-1">
                {[15000, 20000, 25000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateField('production_target_tonnes', preset)}
                    className="text-[10px] font-semibold text-slate-600 hover:text-[#c26d3a] bg-slate-100 hover:bg-orange-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    {preset / 1000}k
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={conditions.production_target_tonnes || ''}
                onChange={(e) => updateField('production_target_tonnes', parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300/80 bg-slate-50/60 px-3.5 py-2.5 text-2xl font-bold font-mono text-slate-900 focus:border-[#c26d3a] focus:bg-white focus:ring-2 focus:ring-[#c26d3a]/20 focus:outline-none transition shadow-2xs"
                placeholder="22000"
              />
              <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-mono font-semibold">
                MT / mo
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-700 mb-1.5 font-semibold">
              Operational Cycle Period
            </label>
            <select
              value={conditions.month || 10}
              onChange={(e) => updateField('month', parseInt(e.target.value))}
              className="w-full rounded-lg border border-slate-300/80 bg-slate-50/60 px-3 py-3 text-xs font-semibold text-slate-900 focus:border-[#c26d3a] focus:bg-white focus:ring-2 focus:ring-[#c26d3a]/20 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              {monthNames.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m} 2026 (Operational Cycle {i + 1})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Accordion Grouped Operational Controls */}
      <div className="rounded border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800">
            Current operating conditions
          </span>
          <span className="text-xs text-slate-500">
            Click section to adjust parameters
          </span>
        </div>

        {/* 1. OPERATIONS */}
        <div className="border-b border-slate-200">
          <button
            type="button"
            aria-expanded={openSection === 'operations'}
            aria-controls="section-operations"
            onClick={() => toggleSection('operations')}
            className="flex w-full items-center justify-between p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#c26d3a] focus-visible:outline-none transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#c26d3a]" />
              <span>Operations & workforce</span>
            </div>
            {openSection === 'operations' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {openSection === 'operations' && (
            <div id="section-operations" className="p-3.5 bg-slate-50/70 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Working hours</label>
                <input
                  type="number"
                  value={conditions.working_hours || 240}
                  onChange={(e) => updateField('working_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Shift duration (h)</label>
                <input
                  type="number"
                  value={conditions.shift_hours || 8}
                  onChange={(e) => updateField('shift_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Active faces</label>
                <input
                  type="number"
                  value={conditions.active_faces || 8}
                  onChange={(e) => updateField('active_faces', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Manpower available</label>
                <input
                  type="number"
                  value={conditions.manpower_available || 920}
                  onChange={(e) => updateField('manpower_available', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. EQUIPMENT */}
        <div className="border-b border-slate-200">
          <button
            type="button"
            aria-expanded={openSection === 'equipment'}
            aria-controls="section-equipment"
            onClick={() => toggleSection('equipment')}
            className="flex w-full items-center justify-between p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#c26d3a] focus-visible:outline-none transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-[#c26d3a]" />
              <span>Heavy machinery & mechanical fleet</span>
            </div>
            {openSection === 'equipment' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {openSection === 'equipment' && (
            <div id="section-equipment" className="p-3.5 bg-slate-50/70 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-slate-200">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Fleet available</label>
                <input
                  type="number"
                  value={conditions.equipment_available_count || 24}
                  onChange={(e) => updateField('equipment_available_count', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Fleet operating</label>
                <input
                  type="number"
                  value={conditions.equipment_operating_count || 22}
                  onChange={(e) => updateField('equipment_operating_count', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Downtime (h)</label>
                <input
                  type="number"
                  value={conditions.equipment_downtime_hours || 12}
                  onChange={(e) => updateField('equipment_downtime_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Maintenance (h)</label>
                <input
                  type="number"
                  value={conditions.maintenance_hours || 45}
                  onChange={(e) => updateField('maintenance_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Breakdowns</label>
                <input
                  type="number"
                  value={conditions.breakdown_count || 1}
                  onChange={(e) => updateField('breakdown_count', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. BLASTING */}
        <div className="border-b border-slate-200">
          <button
            type="button"
            aria-expanded={openSection === 'blasting'}
            aria-controls="section-blasting"
            onClick={() => toggleSection('blasting')}
            className="flex w-full items-center justify-between p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#c26d3a] focus-visible:outline-none transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-[#c26d3a]" />
              <span>Blasting cycle & delays</span>
            </div>
            {openSection === 'blasting' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {openSection === 'blasting' && (
            <div id="section-blasting" className="p-3.5 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Planned blasts</label>
                <input
                  type="number"
                  value={conditions.planned_blasts || 14}
                  onChange={(e) => updateField('planned_blasts', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Completed blasts</label>
                <input
                  type="number"
                  value={conditions.completed_blasts || 13}
                  onChange={(e) => updateField('completed_blasts', parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Blast delay (h)</label>
                <input
                  type="number"
                  value={conditions.blast_delay_hours || 0}
                  onChange={(e) => updateField('blast_delay_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. ORE */}
        <div className="border-b border-slate-200">
          <button
            type="button"
            aria-expanded={openSection === 'ore'}
            aria-controls="section-ore"
            onClick={() => toggleSection('ore')}
            className="flex w-full items-center justify-between p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#c26d3a] focus-visible:outline-none transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Pickaxe className="h-4 w-4 text-[#c26d3a]" />
              <span>Ore grade & broken reserves</span>
            </div>
            {openSection === 'ore' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {openSection === 'ore' && (
            <div id="section-ore" className="p-3.5 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Average ore grade (% Mn)</label>
                <input
                  type="number"
                  step="0.1"
                  value={conditions.ore_grade_pct || 44.5}
                  onChange={(e) => updateField('ore_grade_pct', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Ore available (tonnes)</label>
                <input
                  type="number"
                  value={conditions.ore_tonnage_available || 35000}
                  onChange={(e) => updateField('ore_tonnage_available', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 5. LOGISTICS */}
        <div className="border-b border-slate-200">
          <button
            type="button"
            aria-expanded={openSection === 'logistics'}
            aria-controls="section-logistics"
            onClick={() => toggleSection('logistics')}
            className="flex w-full items-center justify-between p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#c26d3a] focus-visible:outline-none transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-[#c26d3a]" />
              <span>Haulage, power & ventilation</span>
            </div>
            {openSection === 'logistics' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {openSection === 'logistics' && (
            <div id="section-logistics" className="p-3.5 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Transport delays (h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={conditions.transport_delay_hours || 1.5}
                  onChange={(e) => updateField('transport_delay_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Ventilation delays (h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={conditions.ventilation_delay_hours || 2.0}
                  onChange={(e) => updateField('ventilation_delay_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Power outages (h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={conditions.power_outage_hours || 3.0}
                  onChange={(e) => updateField('power_outage_hours', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 6. ENVIRONMENT */}
        <div>
          <button
            type="button"
            aria-expanded={openSection === 'environment'}
            aria-controls="section-environment"
            onClick={() => toggleSection('environment')}
            className="flex w-full items-center justify-between p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#c26d3a] focus-visible:outline-none transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <CloudSun className="h-4 w-4 text-[#c26d3a]" />
              <span>Weather & environmental factors</span>
            </div>
            {openSection === 'environment' ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {openSection === 'environment' && (
            <div id="section-environment" className="p-3.5 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Rainfall (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={conditions.rainfall_mm || 24.5}
                  onChange={(e) => updateField('rainfall_mm', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Ambient temperature (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={conditions.temperature_c || 28.0}
                  onChange={(e) => updateField('temperature_c', parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-[#c26d3a] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evaluate Trigger Action */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#c26d3a] hover:bg-[#b45309] text-white py-3.5 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-900/10 hover:shadow-lg hover:shadow-orange-900/15 cursor-pointer active:scale-[0.99]"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Simulating Target Feasibility...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4 fill-current" />
            <span>Evaluate Target Feasibility</span>
          </>
        )}
      </button>
    </div>
  );
};

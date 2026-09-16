import React from 'react';
import type { ProductionPredictionResult } from '../../types/production';
import { formatTonnes } from '../../lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductionResultCardProps {
  result: ProductionPredictionResult | null;
}

export const ProductionResultCard: React.FC<ProductionResultCardProps> = ({ result }) => {
  if (!result) return null;

  const isAtRisk = result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL';
  const isModerate = result.risk_level === 'MEDIUM';

  // Find max risk factor impact for contribution scaling
  const maxImpact = Math.max(
    ...((result.top_risk_factors || []).map((f) => Math.abs(f.impact_tonnes))),
    1.0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Primary Dominant Outcome Block */}
      <div className="rounded border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-medium text-slate-500">
              {result.mine_name} feasibility assessment
            </span>
            <h2 className="text-base font-semibold text-slate-900 mt-0.5">
              Production feasibility evaluation
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-mono font-medium px-2.5 py-1 rounded border ${
                isAtRisk
                  ? 'border-rose-300 text-rose-700 bg-rose-50'
                  : isModerate
                  ? 'border-amber-300 text-amber-700 bg-amber-50'
                  : 'border-emerald-300 text-emerald-700 bg-emerald-50'
              }`}
            >
              {result.risk_level} risk
            </span>
          </div>
        </div>

        {/* Expected Production as Main Visual Hero */}
        <div>
          <span className="text-xs font-medium text-slate-500 block">
            Expected production output
          </span>
          <div className="flex items-baseline space-x-3 my-1.5">
            <span className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight">
              {formatTonnes(result.expected_production_tonnes)}
            </span>
            <span className="text-sm font-medium text-slate-600">
              ({result.achievement_percentage}% of target)
            </span>
          </div>
        </div>

        {/* Supporting Primary Metrics Hierarchy */}
        <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-3 text-xs">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Production target</span>
            <span className="text-slate-900 font-mono font-semibold text-base">
              {formatTonnes(result.target_production_tonnes)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block font-medium">Shortfall</span>
            <span
              className={`font-mono font-semibold text-base ${
                result.shortfall_tonnes > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {result.shortfall_tonnes > 0
                ? `-${formatTonnes(result.shortfall_tonnes)}`
                : '0 t (Nil)'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block font-medium">Achievement probability</span>
            <span className="text-[#c26d3a] font-mono font-semibold text-base">
              {result.achievement_probability}%
            </span>
          </div>
        </div>

        {/* Decision Summary Banner */}
        <div
          className={`rounded border p-3.5 text-xs sm:text-sm flex items-start space-x-2.5 ${
            isAtRisk
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : isModerate
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {isAtRisk ? (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="leading-relaxed">
            <span className="font-semibold mr-1">Engineering assessment:</span>
            <span>{result.decision_message}</span>
          </div>
        </div>
      </div>

      {/* WHAT IS DRIVING THE RISK? Ranked Operational Contribution */}
      <div className="rounded border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <span className="text-sm font-semibold text-slate-800">
            What is driving the risk?
          </span>
          <span className="text-xs font-mono text-slate-500">
            SHAP attribution
          </span>
        </div>

        <div className="space-y-3">
          {result.top_risk_factors && result.top_risk_factors.length > 0 ? (
            result.top_risk_factors.map((driver, idx) => {
              const pct = Math.min((Math.abs(driver.impact_tonnes) / maxImpact) * 100, 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-900 font-medium">{driver.factor}</span>
                    <span className="font-mono text-xs text-rose-600 font-medium">
                      -{driver.impact_tonnes} t
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">{driver.description}</div>
                  {/* Clean Horizontal Contribution Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-slate-500">
              Operating within nominal parametric thresholds. No major risk drivers identified.
            </div>
          )}
        </div>
      </div>

      {/* OPERATIONAL RESPONSE: Engineering Recommendations */}
      {result.recommended_actions && result.recommended_actions.length > 0 && (
        <div className="rounded border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-sm font-semibold text-slate-800">
              Operational response
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Prioritized interventions
            </span>
          </div>

          <div className="space-y-2.5">
            {result.recommended_actions.map((rec, i) => (
              <div
                key={i}
                className="rounded border border-slate-200 bg-slate-50 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-[#c26d3a] font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-900 font-medium text-xs sm:text-sm">{rec.target_metric}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded border ${
                      rec.priority === 'HIGH'
                        ? 'border-rose-300 text-rose-700 bg-rose-50'
                        : rec.priority === 'MEDIUM'
                        ? 'border-amber-300 text-amber-700 bg-amber-50'
                        : 'border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    {rec.priority.toLowerCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="text-slate-500 text-xs block font-medium mb-0.5">Action:</span>
                  {rec.action}
                </div>

                <div className="text-xs text-slate-600 pt-1.5 border-t border-slate-200">
                  Rationale: <span className="text-slate-900 font-medium">{rec.rationale}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

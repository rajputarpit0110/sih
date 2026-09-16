import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataEnrichmentProgressProps {
  isLoading: boolean;
}

export const DataEnrichmentProgress: React.FC<DataEnrichmentProgressProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const stages = [
    { label: 'LOCATION RESOLVED', detail: 'Coordinates aligned to 1km² survey cell' },
    { label: 'DATA SOURCES', detail: 'Ingesting Sentinel-2, SRTM, Lithology rasters' },
    { label: 'FEATURE VECTOR', detail: 'Formulating 47 normalized geochemical/spectral indices' },
    { label: 'MODEL INFERENCE', detail: 'Executing locked XGBoost prospectivity classifier' },
    { label: 'RESULT', detail: 'Computing TreeSHAP attribution and confidence metrics' },
  ];

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => clearInterval(timer);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded border border-slate-200 bg-white p-4 text-xs shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-semibold">
          Processing Pipeline
        </span>
        <span className="font-mono text-[10px] text-[#c26d3a] flex items-center space-x-1 font-semibold">
          <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
          EXECUTING
        </span>
      </div>

      <div className="space-y-2.5 font-mono">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={stage.label}
              className={`flex items-start justify-between text-[11px] transition-colors ${
                isDone
                  ? 'text-slate-800'
                  : isCurrent
                  ? 'text-[#c26d3a] font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 flex justify-center">
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c26d3a] animate-pulse" />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                  )}
                </div>
                <span>{stage.label}</span>
              </div>

              <span className="text-[10px] text-slate-500">
                {isDone ? 'COMPLETED' : isCurrent ? 'RUNNING...' : 'PENDING'}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

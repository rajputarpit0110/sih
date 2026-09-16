import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#f8fafc] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="mx-auto max-w-5xl border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          System Methodology & Scientific Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          End-to-end data processing pipelines, feature engineering taxonomy, and machine learning architectures for MOIL Problem Statement 26009.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Pipeline 1: Exploration Architecture */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
              Pillar 1 Architecture
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Geospatial Manganese Mineral Prospectivity Pipeline
            </h2>
          </div>

          {/* Visual Sequential Flow Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
            {/* Step 1 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">Step 01</span>
              <div className="text-sm font-bold text-slate-800">Location Pinpoint</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                WGS84 Coordinates mapped to 1km² survey block
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">Step 02</span>
              <div className="text-sm font-bold text-slate-800">Data Ingestion</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Sentinel-2 L2A, SRTM DEM, Lithology & Fault rasters
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">Step 03</span>
              <div className="text-sm font-bold text-slate-800">Feature Vector</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                47 normalized geochemical, spectral & topographic indices
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded border border-[#c26d3a] bg-orange-50/70 p-3.5 text-center space-y-1.5 shadow-xs">
              <span className="text-[11px] text-[#c26d3a] uppercase block font-extrabold">Step 04</span>
              <div className="text-sm font-bold text-[#c26d3a]">XGBoost Model</div>
              <p className="text-xs text-slate-700 font-sans leading-snug font-medium">
                Trained Gradient Boosted Classifier (ROC-AUC: 0.9510)
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3.5 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">Step 05</span>
              <div className="text-sm font-bold text-slate-800">Prospectivity %</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Probability level & TreeSHAP factor attributions
              </p>
            </div>
          </div>

          {/* Geological & Spectral Feature Catalog */}
          <div className="border-t border-slate-200 pt-5 space-y-3.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-700 font-bold block">
              Key Earth Observation & Structural Indices
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                  <span className="font-bold text-slate-900">SWIR Mineral Alteration Ratio</span>
                  <span className="font-extrabold text-[#c26d3a]">B11 / B12</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  Detects hydroxyl-bearing minerals, clay gouges, and hydrothermal alteration zones associated with syngenetic manganese deposition.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                  <span className="font-bold text-slate-900">Iron Oxide (Gossan) Index</span>
                  <span className="font-extrabold text-[#c26d3a]">B04 / B02</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  Identifies ferric and secondary limonite caps typical of supergene manganese enrichment zones in the Sausar Group formations.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                  <span className="font-bold text-slate-900">Lineament & Fault Density</span>
                  <span className="font-extrabold text-[#c26d3a]">km / km²</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  Structural deformation density extracted from multi-directional SRTM shaded hillshades, marking conduit pathways for mineralized fluids.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                  <span className="font-bold text-slate-900">Bouguer Gravity Anomaly</span>
                  <span className="font-extrabold text-[#c26d3a]">mGal</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  Subsurface density variation reflecting high-density manganese ore bodies (braunite, pyrolusite) embedded in schistose country rock.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline 2: Production Decision Architecture */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
              Pillar 2 Architecture
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Operational Production Decision & What-If Simulation Pipeline
            </h2>
          </div>

          {/* Sequential Workflow Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs font-mono">
            {/* Step 1 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">01 Input</span>
              <div className="text-sm font-bold text-slate-800">Mine & Target</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Target tonnage & monthly planning period
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">02 Fleet</span>
              <div className="text-sm font-bold text-slate-800">Fleet & Blasting</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Machinery hours, blast completion, haulage
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded border border-[#c26d3a] bg-orange-50/70 p-3 text-center space-y-1.5 shadow-xs">
              <span className="text-[11px] text-[#c26d3a] uppercase block font-extrabold">03 Inference</span>
              <div className="text-sm font-bold text-[#c26d3a]">Dual Models</div>
              <p className="text-xs text-slate-700 font-sans leading-snug font-medium">
                XGBoost Regressor (R² 0.98) & Classifier (87%)
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">04 Evaluation</span>
              <div className="text-sm font-bold text-slate-800">Shortfall Risk</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Expected tonnage vs target & risk category
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">05 Attribution</span>
              <div className="text-sm font-bold text-slate-800">SHAP Drivers</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Ranked bottleneck drivers & response directives
              </p>
            </div>

            {/* Step 6 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-3 text-center space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase block font-bold">06 Simulation</span>
              <div className="text-sm font-bold text-slate-800">What-If Tool</div>
              <p className="text-xs text-slate-600 font-sans leading-snug">
                Simulate maintenance & shift reallocation deltas
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

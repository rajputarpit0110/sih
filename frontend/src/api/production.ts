import { request } from './client';
import type {
  ProductionConditions,
  ProductionPredictionResult,
  WhatIfSimulationResult,
  ModelPerformanceData,
  RecommendedAction,
} from '../types/production';

export async function predictProduction(conditions: ProductionConditions): Promise<ProductionPredictionResult> {
  return request('/api/production/predict', {
    method: 'POST',
    body: JSON.stringify(conditions),
  });
}

export async function explainProduction(conditions: ProductionConditions): Promise<any> {
  return request('/api/production/explain', {
    method: 'POST',
    body: JSON.stringify(conditions),
  });
}

export async function fetchRecommendations(conditions: ProductionConditions): Promise<{ recommendations: RecommendedAction[] }> {
  return request('/api/production/recommendations', {
    method: 'POST',
    body: JSON.stringify(conditions),
  });
}

export async function runWhatIfSimulation(
  baseline: ProductionConditions,
  scenario: ProductionConditions
): Promise<WhatIfSimulationResult> {
  return request('/api/production/what-if', {
    method: 'POST',
    body: JSON.stringify({ baseline, scenario }),
  });
}

export async function fetchModelPerformance(): Promise<ModelPerformanceData> {
  return request('/api/model-performance');
}

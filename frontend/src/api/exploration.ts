import { request } from './client';
import type { MineLocation, EnrichedFeatureVector, ProspectivityResult, ExplorationPoint } from '../types/exploration';

export async function checkBackendHealth(): Promise<{
  status: string;
  models_loaded: Record<string, boolean>;
  system: string;
  version: string;
  dataset_rows: Record<string, number>;
}> {
  return request('/api/health');
}

export async function fetchMines(): Promise<MineLocation[]> {
  return request('/api/mines');
}

export async function fetchExplorationPoints(limit: number = 1000, minProb: number = 0.3): Promise<ExplorationPoint[]> {
  return request(`/api/exploration/points?limit=${limit}&min_prob=${minProb}`);
}

export async function enrichCoordinates(latitude: number, longitude: number): Promise<EnrichedFeatureVector> {
  return request('/api/exploration/features', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude }),
  });
}

export async function predictProspectivity(
  latitude: number,
  longitude: number,
  features?: Record<string, any>
): Promise<ProspectivityResult> {
  return request('/api/exploration/predict', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude, features }),
  });
}

export async function explainProspectivity(latitude: number, longitude: number): Promise<ProspectivityResult> {
  return request('/api/exploration/explain', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude }),
  });
}

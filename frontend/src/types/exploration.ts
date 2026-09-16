export interface ExplorationPoint {
  cell_id: string;
  latitude: number;
  longitude: number;
  state: string;
  prospectivity_prob: number;
  prospectivity_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
}

export interface MineLocation {
  mine_id: string;
  mine_name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  mine_depth_m: number;
  active_faces: number;
  type: string;
  ore_type: string;
  avg_target_tonnes: number;
  avg_actual_tonnes: number;
  default_equipment_available: number;
  default_equipment_operating: number;
  default_ore_grade: number;
  default_manpower: number;
  latest_target?: number;
  latest_actual?: number;
  avg_achievement_pct?: number;
  avg_shortfall_pct?: number;
}

export interface DataStatus {
  satellite: 'Available' | 'Interpolated' | 'Unavailable';
  terrain: 'Available' | 'Interpolated' | 'Unavailable';
  geology: 'Available' | 'Regional Survey Only' | 'Unavailable';
  soil: 'Available' | 'National Soil Grid' | 'Unavailable';
  weather: 'Available' | 'Interpolated' | 'Unavailable';
  geophysical: 'Available' | 'Interpolated' | 'Unavailable';
}

export interface ContributingFactor {
  feature: string;
  impact: 'positive' | 'negative';
  shap_value: number;
  relative_weight: number;
}

export interface ProspectivityResult {
  latitude: number;
  longitude: number;
  prospectivity_probability: number;
  prospectivity_percent: number;
  predicted_label: number;
  prospectivity_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  state: string;
  district: string;
  lithology: string;
  host_rock: string;
  elevation_m: number;
  data_status: DataStatus;
  top_contributing_factors: ContributingFactor[];
  distance_to_nearest_survey_km: number;
}

export interface EnrichedFeatureVector {
  latitude: number;
  longitude: number;
  is_in_india: boolean;
  is_in_survey_belt: boolean;
  nearest_survey_cell_id: string;
  distance_to_nearest_survey_km: number;
  district: string;
  state: string;
  lithology: string;
  host_rock: string;
  elevation_m: number;
  lineament_density: number;
  iron_oxide_index: number;
  swir_ratio: number;
  data_status: DataStatus;
  feature_vector: Record<string, any>;
}

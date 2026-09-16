export interface ProductionConditions {
  mine_id: string;
  mine_name: string;
  production_target_tonnes: number;
  planned_production_tonnes?: number;
  working_hours?: number;
  shift_hours?: number;
  equipment_available_count?: number;
  equipment_operating_count?: number;
  equipment_downtime_hours?: number;
  maintenance_hours?: number;
  breakdown_count?: number;
  planned_blasts?: number;
  completed_blasts?: number;
  blast_delay_hours?: number;
  blast_delay_count?: number;
  mine_depth_m?: number;
  active_faces?: number;
  ore_grade_pct?: number;
  ore_tonnage_available?: number;
  rainfall_mm?: number;
  temperature_c?: number;
  soil_moisture?: number;
  ventilation_delay_hours?: number;
  ventilation_clearance_delay_hours?: number;
  power_outage_hours?: number;
  transport_delay_hours?: number;
  manpower_available?: number;
  production_lag_1?: number;
  production_rolling_7?: number;
  month?: number;
  day_of_year?: number;
}

export interface OperationalFactor {
  factor: string;
  impact_tonnes: number;
  description: string;
}

export interface RecommendedAction {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  rationale: string;
  target_metric: string;
}

export interface ProductionPredictionResult {
  mine_id: string;
  mine_name: string;
  target_production_tonnes: number;
  expected_production_tonnes: number;
  shortfall_tonnes: number;
  achievement_percentage: number;
  achievement_probability: number;
  shortfall_probability: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision_message: string;
  top_risk_factors: OperationalFactor[];
  top_positive_factors: OperationalFactor[];
  recommended_actions: RecommendedAction[];
}

export interface WhatIfSimulationResult {
  baseline: ProductionPredictionResult;
  scenario: ProductionPredictionResult;
  deltas: {
    expected_production_change_tonnes: number;
    shortfall_change_tonnes: number;
    achievement_probability_change_pct: number;
    risk_shifted: boolean;
    risk_before: string;
    risk_after: string;
  };
  model_statement: string;
}

export interface ModelPerformanceData {
  production_regression: {
    model_type: string;
    metrics: {
      MAE: number;
      RMSE: number;
      R2: number;
    };
    features_count: number;
    train_records: number;
    test_records: number;
    train_period: string;
    test_period: string;
  };
  shortfall_classification: {
    model_type: string;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      roc_auc: number;
    };
  };
  prospectivity_classification: {
    model_type: string;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      roc_auc: number;
      train_rows: number;
      test_rows: number;
    };
    features_count: number;
    feature_domains: Array<{
      domain: string;
      count: number;
      signals: string;
    }>;
  };
}

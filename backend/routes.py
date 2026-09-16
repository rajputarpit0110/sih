from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from .models_service import service

router = APIRouter(prefix="/api")


class CoordinateRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")


class ExplorationPredictRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    features: Optional[Dict[str, Any]] = None


class ProductionPredictRequest(BaseModel):
    mine_id: Optional[str] = "MOIL-07"
    mine_name: Optional[str] = "Balaghat"
    production_target_tonnes: float = Field(..., gt=0.0)
    planned_production_tonnes: Optional[float] = None
    working_hours: Optional[float] = 240.0
    shift_hours: Optional[float] = 8.0
    equipment_available_count: Optional[int] = 24
    equipment_operating_count: Optional[int] = 22
    equipment_downtime_hours: Optional[float] = 12.0
    maintenance_hours: Optional[float] = 45.0
    breakdown_count: Optional[int] = 1
    planned_blasts: Optional[int] = 14
    completed_blasts: Optional[int] = 13
    blast_delay_hours: Optional[float] = 0.0
    blast_delay_count: Optional[int] = 0
    mine_depth_m: Optional[float] = 383.0
    active_faces: Optional[int] = 8
    ore_grade_pct: Optional[float] = 44.5
    ore_tonnage_available: Optional[float] = None
    rainfall_mm: Optional[float] = 24.5
    temperature_c: Optional[float] = 28.0
    soil_moisture: Optional[float] = 0.18
    ventilation_delay_hours: Optional[float] = 2.0
    ventilation_clearance_delay_hours: Optional[float] = 1.0
    power_outage_hours: Optional[float] = 3.0
    transport_delay_hours: Optional[float] = 1.5
    manpower_available: Optional[int] = 920
    production_lag_1: Optional[float] = None
    production_rolling_7: Optional[float] = None
    month: Optional[int] = 10
    day_of_year: Optional[int] = 285


class WhatIfRequest(BaseModel):
    baseline: ProductionPredictRequest
    scenario: ProductionPredictRequest


@router.get("/health")
def get_health():
    return service.get_health()


@router.get("/mines")
def get_mines():
    return service.get_mines()


@router.get("/exploration/points")
def get_exploration_points(limit: int = 1500, min_prob: float = 0.0):
    return service.get_exploration_points(limit=limit, min_prob=min_prob)


@router.post("/exploration/features")
def enrich_exploration_features(req: CoordinateRequest):
    try:
        return service.enrich_coordinates(req.latitude, req.longitude)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature enrichment failed: {str(e)}")


@router.post("/exploration/predict")
def predict_exploration(req: ExplorationPredictRequest):
    try:
        return service.predict_prospectivity(req.latitude, req.longitude, req.features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prospectivity prediction failed: {str(e)}")


@router.post("/exploration/explain")
def explain_exploration(req: CoordinateRequest):
    try:
        enrichment = service.enrich_coordinates(req.latitude, req.longitude)
        return service.predict_prospectivity(req.latitude, req.longitude, enrichment["feature_vector"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prospectivity explanation failed: {str(e)}")


@router.post("/production/predict")
def predict_production_endpoint(req: ProductionPredictRequest):
    try:
        return service.predict_production(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Production prediction failed: {str(e)}")


@router.post("/production/explain")
def explain_production_endpoint(req: ProductionPredictRequest):
    try:
        df_input = service._prepare_production_features(req.model_dump())
        return service.explain_production(df_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Production explanation failed: {str(e)}")


@router.post("/production/recommendations")
def recommendations_production_endpoint(req: ProductionPredictRequest):
    try:
        pred = service.predict_production(req.model_dump())
        return {"recommendations": pred["recommended_actions"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")


@router.post("/production/what-if")
def simulate_what_if_endpoint(req: WhatIfRequest):
    try:
        return service.simulate_what_if(req.baseline.model_dump(), req.scenario.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"What-if simulation failed: {str(e)}")


@router.get("/model-performance")
def get_model_performance_endpoint():
    try:
        return service.get_model_performance()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not retrieve model performance: {str(e)}")

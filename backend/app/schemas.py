from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WeatherRequest(BaseModel):
    latitude: float
    longitude: float

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    rain_probability: float
    wind_speed: float
    condition: str

class AdvisoryRequest(BaseModel):
    crop_type: str
    growth_stage: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AdvisoryResponse(BaseModel):
    advisory_text: str
    recommendations: str
    weather_condition: str
    risk_alerts: Optional[list] = None

class RiskAlertResponse(BaseModel):
    alert_type: str
    severity: str
    message: str
    trigger_conditions: str

class CropResponse(BaseModel):
    name: str
    optimal_temp_min: float
    optimal_temp_max: float
    water_need: str
    disease_risk: str

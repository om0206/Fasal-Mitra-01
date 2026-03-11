from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from datetime import datetime
from app.database import Base

class Crop(Base):
    __tablename__ = "crops"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    optimal_temp_min = Column(Float)
    optimal_temp_max = Column(Float)
    water_need = Column(String)  # "low", "medium", "high"
    disease_risk = Column(String)  # comma-separated list of common diseases

class WeatherData(Base):
    __tablename__ = "weather_data"
    
    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    rain_probability = Column(Float)
    wind_speed = Column(Float)
    condition = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Advisory(Base):
    __tablename__ = "advisories"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_type = Column(String, index=True)
    growth_stage = Column(String)
    weather_condition = Column(String)
    advisory_text = Column(Text)
    recommendations = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class RiskAlert(Base):
    __tablename__ = "risk_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_type = Column(String)
    growth_stage = Column(String)
    alert_type = Column(String)  # e.g., "Fungal Risk Alert"
    severity = Column(String)  # "low", "medium", "high"
    message = Column(Text)
    trigger_conditions = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

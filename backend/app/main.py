from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.database import engine, get_db, Base
from app.models import Crop, Advisory, RiskAlert, WeatherData
from app.schemas import AdvisoryRequest, AdvisoryResponse, RiskAlertResponse, CropResponse
from app.weather_service import get_weather_data
from app.llm_service import generate_crop_advisory, extract_recommendations
from app.rules_engine import RulesEngine

# Create database tables
Base.metadata.create_all(bind=engine)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Crop Advisory API",
    description="Agricultural decision engine with LLM and autonomous risk triggers",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize sample crop data on startup"""
    db = next(get_db())
    try:
        # Check if crops already exist
        crops = db.query(Crop).all()
        if not crops:
            sample_crops = [
                Crop(
                    name="Wheat",
                    optimal_temp_min=10,
                    optimal_temp_max=25,
                    water_need="medium",
                    disease_risk="Rust, Septoria, Powdery Mildew"
                ),
                Crop(
                    name="Rice",
                    optimal_temp_min=20,
                    optimal_temp_max=30,
                    water_need="high",
                    disease_risk="Blast, Brown Spot, Bacterial Blight"
                ),
                Crop(
                    name="Tomato",
                    optimal_temp_min=15,
                    optimal_temp_max=28,
                    water_need="medium",
                    disease_risk="Early Blight, Late Blight, Fusarium Wilt"
                ),
                Crop(
                    name="Cotton",
                    optimal_temp_min=18,
                    optimal_temp_max=32,
                    water_need="medium",
                    disease_risk="Leaf Curl, Wilt, Anthracnose"
                ),
                Crop(
                    name="Potato",
                    optimal_temp_min=15,
                    optimal_temp_max=25,
                    water_need="medium",
                    disease_risk="Late Blight, Early Blight, Dry Rot"
                ),
            ]
            db.add_all(sample_crops)
            db.commit()
            logger.info("Sample crops initialized")
    finally:
        db.close()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Crop Advisory API",
        "endpoints": {
            "advisor": "/api/advisor",
            "crops": "/api/crops",
            "weather": "/api/weather"
        }
    }

@app.get("/api/crops", response_model=list[CropResponse])
async def get_crops(db: Session = Depends(get_db)):
    """Get all available crops"""
    crops = db.query(Crop).all()
    return crops

@app.post("/api/advisor", response_model=AdvisoryResponse)
async def get_crop_advisory(
    request: AdvisoryRequest,
    db: Session = Depends(get_db)
):
    """
    Main endpoint: Get crop advisory with weather integration and risk assessment
    
    Takes:
    - crop_type: Type of crop
    - growth_stage: Current growth stage (seedling, vegetative, flowering, fruiting, maturation)
    - latitude (optional): For weather data
    - longitude (optional): For weather data
    """
    try:
        # Validate crop exists
        crop = db.query(Crop).filter(Crop.name.ilike(request.crop_type)).first()
        if not crop:
            raise HTTPException(status_code=400, detail=f"Crop '{request.crop_type}' not found")
        
        # Get weather data
        if request.latitude and request.longitude:
            weather_data = await get_weather_data(request.latitude, request.longitude)
        else:
            # Use default weather data if coordinates not provided
            weather_data = {
                "temperature": 22,
                "humidity": 65,
                "rain_probability": 35,
                "wind_speed": 10,
                "condition": "Partly cloudy"
            }
        
        # Generate LLM-based advisory using Groq
        advisory_text = await generate_crop_advisory(
            request.crop_type,
            request.growth_stage,
            weather_data
        )
        
        # Extract recommendations
        recommendations = await extract_recommendations(advisory_text)
        
        # Run autonomous triggers - check for risks
        risk_alerts = RulesEngine.check_all_risks(
            weather_data,
            request.growth_stage,
            request.crop_type
        )
        
        # Save advisory to database
        new_advisory = Advisory(
            crop_type=request.crop_type,
            growth_stage=request.growth_stage,
            weather_condition=weather_data.get("condition", ""),
            advisory_text=advisory_text,
            recommendations=recommendations
        )
        db.add(new_advisory)
        
        # Save risk alerts to database
        for alert in risk_alerts:
            new_alert = RiskAlert(
                crop_type=request.crop_type,
                growth_stage=request.growth_stage,
                alert_type=alert["alert_type"],
                severity=alert["severity"],
                message=alert["message"],
                trigger_conditions=alert["trigger_conditions"]
            )
            db.add(new_alert)
        
        db.commit()
        
        return AdvisoryResponse(
            advisory_text=advisory_text,
            recommendations=recommendations,
            weather_condition=f"Temperature: {weather_data['temperature']}°C, Humidity: {weather_data['humidity']}%, Rain Probability: {weather_data['rain_probability']}%",
            risk_alerts=[{
                "alert_type": alert["alert_type"],
                "severity": alert["severity"],
                "message": alert["message"],
                "trigger_conditions": alert["trigger_conditions"]
            } for alert in risk_alerts]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in advisor endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/weather")
async def get_weather(request: dict):
    """
    Get weather data for a location
    
    Body:
    - latitude: float
    - longitude: float
    """
    try:
        weather_data = await get_weather_data(request.get("latitude"), request.get("longitude"))
        return weather_data
    except Exception as e:
        logger.error(f"Error fetching weather: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history/advisories")
async def get_advisory_history(crop_type: str = None, db: Session = Depends(get_db)):
    """Get historical advisories"""
    query = db.query(Advisory)
    if crop_type:
        query = query.filter(Advisory.crop_type.ilike(crop_type))
    
    advisories = query.order_by(Advisory.created_at.desc()).limit(10).all()
    return advisories

@app.get("/api/history/alerts")
async def get_alert_history(db: Session = Depends(get_db)):
    """Get historical risk alerts"""
    alerts = db.query(RiskAlert).order_by(RiskAlert.created_at.desc()).limit(20).all()
    return alerts

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

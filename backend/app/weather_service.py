import requests
from typing import Dict
import logging

logger = logging.getLogger(__name__)

# Using Open-Meteo API (free, no API key required)
OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast"

async def get_weather_data(latitude: float, longitude: float) -> Dict:
    """
    Fetch weather data from Open-Meteo API
    Returns current weather conditions including rain probability
    """
    try:
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m",
            "timezone": "auto"
        }
        
        response = requests.get(OPEN_METEO_API, params=params)
        response.raise_for_status()
        
        data = response.json()
        current = data.get("current", {})
        
        # Extract relevant weather data
        weather_data = {
            "temperature": current.get("temperature_2m", 0),
            "humidity": current.get("relative_humidity_2m", 0),
            "rain_probability": 0,  # Will be updated from forecast
            "wind_speed": current.get("wind_speed_10m", 0),
            "condition": get_weather_condition(current.get("weather_code", 0)),
            "is_raining": current.get("rain", 0) > 0
        }
        
        # Get hourly forecast for rain probability
        hourly_params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": "precipitation_probability",
            "timezone": "auto"
        }
        
        forecast_response = requests.get(OPEN_METEO_API, params=hourly_params)
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()
        
        hourly = forecast_data.get("hourly", {})
        precipitation_probs = hourly.get("precipitation_probability", [])
        
        if precipitation_probs:
            # Get average rain probability for next 24 hours
            weather_data["rain_probability"] = sum(precipitation_probs[:24]) / len(precipitation_probs[:24])
        
        return weather_data
        
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        # Return default/safe values on error
        return {
            "temperature": 25,
            "humidity": 60,
            "rain_probability": 0,
            "wind_speed": 5,
            "condition": "Unknown",
            "is_raining": False
        }

def get_weather_condition(code: int) -> str:
    """
    Convert WMO weather code to readable condition
    """
    if code == 0:
        return "Clear sky"
    elif code == 1:
        return "Mainly clear"
    elif code == 2:
        return "Partly cloudy"
    elif code == 3:
        return "Overcast"
    elif code in [45, 48]:
        return "Foggy"
    elif code in [51, 53, 55]:
        return "Drizzle"
    elif code in [61, 63, 65]:
        return "Rain"
    elif code in [71, 73, 75]:
        return "Snow"
    elif code in [80, 81, 82]:
        return "Rain showers"
    elif code in [85, 86]:
        return "Snow showers"
    elif code in [80, 81, 82]:
        return "Thunderstorm"
    else:
        return "Variable conditions"

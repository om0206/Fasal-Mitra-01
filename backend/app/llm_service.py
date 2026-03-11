import os
from groq import Groq
import logging
from typing import Dict

logger = logging.getLogger(__name__)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

async def generate_crop_advisory(
    crop_type: str,
    growth_stage: str,
    weather_data: Dict
) -> str:
    """
    Generate crop advisory using Groq API with LLaMA 3
    """
    try:
        # Create a detailed prompt for the LLM
        prompt = f"""You are an expert agricultural advisor. Based on the following information, provide a concise and actionable crop advisory:

Crop: {crop_type}
Growth Stage: {growth_stage}
Current Temperature: {weather_data.get('temperature', 'N/A')}°C
Humidity: {weather_data.get('humidity', 'N/A')}%
Rain Probability: {weather_data.get('rain_probability', 'N/A')}%
Wind Speed: {weather_data.get('wind_speed', 'N/A')} km/h
Weather Condition: {weather_data.get('condition', 'N/A')}

Please provide:
1. Current Advisory: What should the farmer do right now?
2. Key Recommendations: 2-3 specific actions
3. Risk Assessment: Any immediate risks to watch for

Keep the response concise and farmer-friendly."""

        message = client.messages.create(
            model="llama-3-70b-versatile",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        advisory_text = message.content[0].text
        return advisory_text
        
    except Exception as e:
        logger.error(f"Error generating advisory: {e}")
        return f"Unable to generate advisory at this time. Please ensure crop type '{crop_type}' is valid."

async def extract_recommendations(advisory_text: str) -> str:
    """
    Extract key recommendations from the advisory text
    """
    try:
        message = client.messages.create(
            model="llama-3-70b-versatile",
            max_tokens=512,
            messages=[
                {
                    "role": "user",
                    "content": f"""From this agricultural advisory, extract the key recommendations as a bullet list:

{advisory_text}

Format as:
- Recommendation 1
- Recommendation 2
- Recommendation 3"""
                }
            ]
        )
        
        return message.content[0].text
        
    except Exception as e:
        logger.error(f"Error extracting recommendations: {e}")
        return "Check soil moisture and monitor for pests regularly"

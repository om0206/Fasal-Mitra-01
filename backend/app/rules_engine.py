import logging
from typing import Dict, List
from datetime import datetime

logger = logging.getLogger(__name__)

class RulesEngine:
    """
    Autonomous trigger system for risk detection
    """
    
    # Risk scoring rules
    RISK_THRESHOLDS = {
        "fungal_risk": {
            "rain_probability": 60,  # Greater than this value
            "humidity_threshold": 80,
            "temperature_optimal_range": (15, 25),  # Fungal growth optimal temp
        },
        "heat_stress": {
            "temperature_threshold": 35,
        },
        "drought_risk": {
            "rain_probability": 10,  # Less than this value
            "humidity_threshold": 30,
        },
        "frost_risk": {
            "temperature_threshold": 0,
        }
    }
    
    GROWTH_STAGE_VULNERABILITY = {
        "flowering": ["fungal_risk", "heat_stress"],
        "fruiting": ["fungal_risk", "drought_risk"],
        "seedling": ["heat_stress", "frost_risk"],
        "vegetative": ["drought_risk"],
        "maturation": ["heat_stress"]
    }
    
    @staticmethod
    def check_fungal_risk(
        weather_data: Dict,
        growth_stage: str,
        crop_type: str
    ) -> Dict | None:
        """
        Check for fungal risk: rain probability > 60% AND growth stage is flowering
        This is the primary autonomous trigger
        """
        rain_prob = weather_data.get("rain_probability", 0)
        humidity = weather_data.get("humidity", 0)
        temperature = weather_data.get("temperature", 20)
        
        # Trigger condition: rain > 60% AND flowering stage
        if rain_prob > RulesEngine.RISK_THRESHOLDS["fungal_risk"]["rain_probability"]:
            if growth_stage.lower() == "flowering":
                # Additional check: temperature is in optimal fungal growth range
                temp_min, temp_max = RulesEngine.RISK_THRESHOLDS["fungal_risk"]["temperature_optimal_range"]
                if temp_min <= temperature <= temp_max:
                    return {
                        "alert_type": "Fungal Risk Alert",
                        "severity": "high",
                        "message": f"HIGH RISK: Fungal infection risk is HIGH. Rain probability: {rain_prob:.0f}%, Temperature: {temperature}°C, Humidity: {humidity:.0f}%. Your {crop_type} crop is at flowering stage and highly susceptible. Recommended: Apply fungicide immediately and increase crop monitoring.",
                        "trigger_conditions": f"rain_probability>{RulesEngine.RISK_THRESHOLDS['fungal_risk']['rain_probability']}% AND growth_stage=flowering AND temperature_in_range({temp_min}-{temp_max}°C)",
                        "risk_score": min(100, (rain_prob / 100 * humidity / 100) * 150)  # Risk score out of 100
                    }
                elif humidity > RulesEngine.RISK_THRESHOLDS["fungal_risk"]["humidity_threshold"]:
                    return {
                        "alert_type": "Fungal Risk Alert",
                        "severity": "medium",
                        "message": f"MODERATE RISK: Fungal infection risk is MODERATE. Rain probability: {rain_prob:.0f}%, Humidity: {humidity:.0f}%. Your {crop_type} crop is at flowering stage. Recommended: Monitor closely and prepare fungicide application.",
                        "trigger_conditions": f"rain_probability>{RulesEngine.RISK_THRESHOLDS['fungal_risk']['rain_probability']}% AND growth_stage=flowering AND humidity>{RulesEngine.RISK_THRESHOLDS['fungal_risk']['humidity_threshold']}%",
                        "risk_score": min(100, (rain_prob / 100 * humidity / 100) * 100)
                    }
        
        return None
    
    @staticmethod
    def check_heat_stress(weather_data: Dict, growth_stage: str, crop_type: str) -> Dict | None:
        """
        Check for heat stress risk
        """
        temperature = weather_data.get("temperature", 20)
        
        if temperature > RulesEngine.RISK_THRESHOLDS["heat_stress"]["temperature_threshold"]:
            return {
                "alert_type": "Heat Stress Alert",
                "severity": "high" if temperature > 40 else "medium",
                "message": f"Heat stress risk detected. Temperature: {temperature}°C (above {RulesEngine.RISK_THRESHOLDS['heat_stress']['temperature_threshold']}°C). Ensure adequate irrigation for {crop_type}.",
                "trigger_conditions": f"temperature>{RulesEngine.RISK_THRESHOLDS['heat_stress']['temperature_threshold']}°C",
                "risk_score": min(100, (temperature / 50) * 100)
            }
        
        return None
    
    @staticmethod
    def check_drought_risk(weather_data: Dict, growth_stage: str, crop_type: str) -> Dict | None:
        """
        Check for drought risk
        """
        rain_prob = weather_data.get("rain_probability", 0)
        humidity = weather_data.get("humidity", 0)
        
        if rain_prob < RulesEngine.RISK_THRESHOLDS["drought_risk"]["rain_probability"] and \
           humidity < RulesEngine.RISK_THRESHOLDS["drought_risk"]["humidity_threshold"]:
            return {
                "alert_type": "Drought Risk Alert",
                "severity": "medium",
                "message": f"Drought risk detected. Rain probability: {rain_prob:.0f}%, Humidity: {humidity:.0f}%. Increase irrigation for {crop_type} at {growth_stage} stage.",
                "trigger_conditions": f"rain_probability<{RulesEngine.RISK_THRESHOLDS['drought_risk']['rain_probability']}% AND humidity<{RulesEngine.RISK_THRESHOLDS['drought_risk']['humidity_threshold']}%",
                "risk_score": 60
            }
        
        return None
    
    @staticmethod
    def check_all_risks(
        weather_data: Dict,
        growth_stage: str,
        crop_type: str
    ) -> List[Dict]:
        """
        Check all autonomous triggers and return all active alerts
        """
        alerts = []
        
        # Check fungal risk (PRIMARY)
        fungal_alert = RulesEngine.check_fungal_risk(weather_data, growth_stage, crop_type)
        if fungal_alert:
            alerts.append(fungal_alert)
        
        # Check heat stress
        heat_alert = RulesEngine.check_heat_stress(weather_data, growth_stage, crop_type)
        if heat_alert:
            alerts.append(heat_alert)
        
        # Check drought risk
        drought_alert = RulesEngine.check_drought_risk(weather_data, growth_stage, crop_type)
        if drought_alert:
            alerts.append(drought_alert)
        
        return alerts
    
    @staticmethod
    def get_risk_summary(alerts: List[Dict]) -> str:
        """
        Generate a summary of all active risks
        """
        if not alerts:
            return "No significant risks detected. Conditions are favorable for your crop."
        
        summary = f"⚠️ {len(alerts)} risk(s) detected:\n\n"
        for i, alert in enumerate(alerts, 1):
            summary += f"{i}. {alert['alert_type']} (Severity: {alert['severity'].upper()})\n"
        
        return summary

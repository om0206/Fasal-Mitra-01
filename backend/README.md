# Crop Advisory Backend

FastAPI server providing agricultural decision engine with LLM and autonomous risk triggers.

## Features

- **LLM-Powered Advisory**: Uses Groq API with LLaMA 3 to generate crop-specific advisories
- **Weather Integration**: Fetches real-time weather data from Open-Meteo API
- **Autonomous Risk Triggers**: Detects risks like fungal infections, heat stress, drought
- **SQLite Database**: Stores advisories, alerts, and crop data
- **Rules Engine**: Smart trigger system for risk detection

## Setup

### Prerequisites
- Python 3.8+
- Groq API Key (get from https://console.groq.com)

### Installation

1. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set environment variables**:
Create a `.env` file in the backend directory:
```
GROQ_API_KEY=your_groq_api_key_here
```

4. **Run the server**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Get Crop Advisory (Main Endpoint)
```
POST /api/advisor
```
**Body:**
```json
{
  "crop_type": "Wheat",
  "growth_stage": "flowering",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Response:**
- Advisory text from LLaMA 3
- Key recommendations
- Risk alerts (if any)
- Weather conditions

### Get Available Crops
```
GET /api/crops
```

### Get Weather
```
POST /api/weather
```

### Get History
```
GET /api/history/advisories
GET /api/history/alerts
```

## Key Demo Features

### 1. Dynamic Advisory Generation
The advisory changes based on:
- Crop type
- Growth stage
- Weather conditions (temperature, humidity, rain probability)

### 2. Autonomous Trigger System
**Primary Trigger: Fungal Risk Alert**
Fires when:
- Rain probability > 60% AND
- Crop stage is "flowering" AND
- Temperature in optimal fungal growth range (15-25°C)

Try adjusting the rain probability or growth stage to see the trigger fire!

## Database Schema

- **Crops**: Available crop types with optimal conditions
- **WeatherData**: Cached weather information
- **Advisory**: Generated advisories with recommendations
- **RiskAlert**: Triggered risk alerts with severity levels

## Architecture

```
FastAPI Server
├── Weather Service (Open-Meteo API)
├── LLM Service (Groq + LLaMA 3)
├── Rules Engine (Autonomous Triggers)
└── SQLite Database
```

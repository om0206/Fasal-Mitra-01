# Crop Advisory System - Complete Setup Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Mobile App (React Native)                  │
│  - Advisory Screen (Crop type, Growth stage input)           │
│  - Risk Alert Display (Fungal Risk, Heat Stress, Drought)    │
│  - History Tab (Past advisories & alerts)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP Axios
                         │
        ┌────────────────▼────────────────┐
        │   FastAPI Backend (Port 8000)   │
        │  ┌────────────────────────────┐ │
        │  │ LLM Service (Groq+LLaMA 3) │ │
        │  │ Weather Service (Open-Meta)│ │
        │  │ Rules Engine (Triggers)    │ │
        │  │ SQLite Database            │ │
        │  └────────────────────────────┘ │
        └────────────────────────────────┘
```

## Prerequisites

- **Python 3.8+** (Backend)
- **Node.js 18+** (Frontend)  
- **Groq API Key** (Free from https://console.groq.com)
- Two terminal windows

## Backend Setup (FastAPI)

### Step 1: Install Backend Dependencies

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 2: Configure Environment

Create `.env` file in backend directory:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get free Groq API key: https://console.groq.com

### Step 3: Run FastAPI Server

```bash
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Check API is running: Visit `http://localhost:8000` in browser

### Step 4: Verify Backend

Open another terminal:
```bash
# Get available crops
curl http://localhost:8000/api/crops

# Test advisory endpoint
curl -X POST http://localhost:8000/api/advisor \
  -H "Content-Type: application/json" \
  -d '{
    "crop_type": "Wheat",
    "growth_stage": "flowering"
  }'
```

## Frontend Setup (React Native)

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 2: Verify API Connection

The app automatically checks connection to backend. Make sure backend is running before starting app.

### Step 3: Start Frontend

```bash
npm start
```

Options will appear:
- Press `w` for web browser (Recommended for quick demo)
- Press `a` for Android emulator (requires Android SDK)
- Press `i` for iOS simulator (Mac only)

### Step 4: Test the App

1. **Advisory Screen**:
   - Select a crop (Wheat, Rice, Tomato, Cotton, Potato)
   - Select growth stage (Seedling, Vegetative, Flowering, Fruiting, Maturation)
   - Click "Get Advisory"
   - Wait for LLM response (10-15 seconds)

2. **Risk Alert Demo**:
   - Select Wheat → Flowering
   - Get Advisory
   - You'll see risk alerts (if triggered by weather conditions)
   - Fungal Risk Alert fires when rain probability > 60%

3. **History Tab**:
   - View all past advisories
   - View triggered risk alerts with severity levels

## API Endpoints

### Main Advisory Endpoint
```
POST /api/advisor
Content-Type: application/json

{
  "crop_type": "Wheat",
  "growth_stage": "flowering",
  "latitude": 28.6139,      # Optional (for real weather)
  "longitude": 77.2090      # Optional
}

Response:
{
  "advisory_text": "LLM-generated advisory...",
  "recommendations": "- Recommendation 1\n- Recommendation 2...",
  "weather_condition": "Temperature: 22°C, Humidity: 65%...",
  "risk_alerts": [
    {
      "alert_type": "Fungal Risk Alert",
      "severity": "high",
      "message": "HIGH RISK: Fungal infection risk...",
      "trigger_conditions": "rain_probability>60% AND growth_stage=flowering..."
    }
  ]
}
```

### Other Endpoints
```
GET /api/crops                    # List all crops
POST /api/weather                 # Get weather for coordinates
GET /api/history/advisories       # Past advisories
GET /api/history/alerts          # Past alerts
GET /api/health                   # Health check
```

## Database

SQLite database is auto-created at `backend/data/crop_advisory.db`

Tables:
- **crops**: Available crop types with growing conditions
- **weather_data**: Cached weather information
- **advisory**: Generated advisories with recommendations
- **riskAlert**: Triggered risk alerts with history

## Key Features to Demo

### 1. LLM-Powered Advisory (Groq + LLaMA 3)
- Generates context-aware advice based on:
  - Crop type
  - Growth stage
  - Real weather conditions
- Changes dynamically when inputs change

### 2. Autonomous Risk Trigger System
**Primary Trigger: Fungal Risk Alert**
```
IF rain_probability > 60%
   AND growth_stage == "flowering"
   AND temperature IN [15°C, 25°C]  // Optimal fungal growth
THEN
   Fire "Fungal Risk Alert" with HIGH severity
```

**Try this**:
1. Select Wheat
2. Select "Flowering" stage
3. Get Advisory
4. System checks weather
5. If rain probability > 60%, Fungal Risk Alert fires!

### 3. Rule-Based Decision Engine
- Heat Stress Alert: Temperature > 35°C
- Drought Risk Alert: Low rain probability + low humidity
- Fungal Risk Alert: High rain + flowering stage

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Mac/Linux

# Kill process or use different port
python -m uvicorn main:app --port 8001
```

**Groq API Error:**
- Verify API key in `.env` file
- Get new key from https://console.groq.com
- Check Groq API is available (not rate limited)

**Database Issues:**
```bash
# Reset database
rm backend/data/crop_advisory.db
# Database will be recreated on next run
```

### Frontend Issues

**Connection Error to Backend:**
- Ensure backend is running on localhost:8000
- Check firewall is not blocking requests
- Update `API_BASE_URL` in `frontend/services/api.ts` if needed

**Expo Installation Issues:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Start Backend API
2. ✅ Start Frontend App  
3. ✅ Test advisory generation
4. ✅ Trigger risk alerts
5. 📈 Deploy to cloud (Firebase, AWS, etc.)
6. 🔄 Add more crop types and triggers
7. 📱 Build native apps (APK, IPA)

## File Structure

```
Loop_Prototype/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── database.py      # DB setup
│   │   ├── weather_service.py
│   │   ├── llm_service.py
│   │   ├── rules_engine.py
│   │   └── schemas.py       # Pydantic models
│   ├── requirements.txt
│   ├── .env
│   └── data/
│       └── crop_advisory.db # SQLite
│
└── frontend/
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx    # Advisory screen
    │   │   └── explore.tsx  # History screen
    │   └── _layout.tsx
    ├── components/
    │   ├── AdvisoryCard.tsx
    │   ├── RiskAlertBanner.tsx
    │   ├── InputForm.tsx
    │   └── ...
    ├── services/
    │   └── api.ts           # API client
    ├── package.json
    └── app.json
```

## Support

For issues or questions:
1. Check backend logs at `http://localhost:8000`
2. Check frontend console (press 'j' in Expo CLI)
3. Verify environment setup matches above
4. Ensure all ports are correct and accessible

Happy Farming! 🌾

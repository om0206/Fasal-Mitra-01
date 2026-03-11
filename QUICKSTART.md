# 🌾 Crop Advisory System - Quick Start

## What's Been Built

A complete **agricultural decision engine** with:

✅ **FastAPI Backend** with LLM + Weather API + Rules Engine
- LLaMA 3 powered advisories via Groq API
- Real-time weather integration (Open-Meteo - free, no API key)
- SQLite database for history tracking
- Autonomous trigger system for risk detection

✅ **React Native Frontend** (Expo) with intuitive UI
- Advisory generation screen
- Risk alert dashboard
- History tracking
- Simple, farmer-friendly interface

✅ **Core Demo Features**
- Dynamic advisory generation based on crop type & growth stage
- Autonomous "Fungal Risk Alert" that fires when rain > 60% AND flowering stage
- Weather-dependent recommendations
- Full history of advisories and triggered alerts

---

## ⚡ Quick Start (2 Minutes)

### Terminal 1: Start Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Create .env file with your Groq API key
echo GROQ_API_KEY=your_key_here > .env

# Run backend
python -m uvicorn app.main:app --reload --port 8000
```

✅ Visit `http://localhost:8000` to verify (you should see a JSON response)

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm start
```

Press `w` to open in web browser

---

## 🎯 Demo Flow (Try This!)

### Scenario 1: Dynamic Advisory
1. **Advisory Tab** → Select "Wheat"
2. Select "Flowering" stage
3. Click "Get Advisory"
4. Wait for LLaMA 3 response (~10 seconds)
5. See the advisory card with recommendations
6. Change to "Vegetative" → Advisory updates automatically ✨

### Scenario 2: Trigger Fungal Risk Alert
The backend automatically calls Open-Meteo weather API. When:
- Rain probability > 60% AND
- Growth stage is "flowering"

**THEN:** "Fungal Risk Alert" fires with HIGH severity! 

(The exact weather determines if the alert shows)

### Scenario 3: View History
1. Click **History Tab**
2. See all your past advisories
3. Switch to "Alerts" to view triggered risk alerts
4. Each alert shows severity (HIGH/MEDIUM/LOW) with color coding

---

## 📁 Project Structure

```
Loop_Prototype/
├── SETUP.md                    ← Detailed setup guide
├── backend/
│   ├── requirements.txt        ← Python dependencies
│   ├── .env.example           ← Copy to .env and add Groq key
│   ├── app/
│   │   ├── main.py            ← FastAPI endpoints
│   │   ├── models.py          ← Database models
│   │   ├── weather_service.py ← Weather API calls
│   │   ├── llm_service.py     ← Groq/LLaMA 3
│   │   └── rules_engine.py    ← Autonomous triggers
│   └── data/
│       └── crop_advisory.db   ← SQLite (auto-created)
│
└── frontend/
    ├── package.json           ← JS dependencies
    ├── app/(tabs)/
    │   ├── index.tsx          ← Advisory screen
    │   └── explore.tsx        ← History screen
    └── components/
        ├── AdvisoryCard.tsx   ← Advisory display
        ├── RiskAlertBanner.tsx ← Risk alerts
        └── InputForm.tsx      ← Input controls
```

---

## 🔑 Key Technologies

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- Groq API (LLaMA 3 model)
- Open-Meteo (Free weather API, no key needed!)
- SQLite

**Frontend:**
- React Native with Expo
- Axios (HTTP client)
- React Picker (Dropdowns)
- Material Community Icons

---

##  Architecture Diagram

```
┌──────────────────────────┐
│  React Native Frontend    │
│  (Expo) - Port 19006     │
│                          │
│ Advisory | History       │
└────────────┬─────────────┘
             │
          Axios
             │
    ┌────────▼────────┐
    │ FastAPI Backend │
    │ (Port 8000)     │
    │                 │
    │ ┌─────────────┐ │
    │ │Groq API     │ │
    │ │(LLaMA 3)    │ │
    │ └─────────────┘ │
    │                 │
    │ ┌─────────────┐ │
    │ │Open-Meteo   │ │
    │ │(Weather)    │ │
    │ └─────────────┘ │
    │                 │
    │ ┌─────────────┐ │
    │ │Rules Engine │ │
    │ │(Triggers)   │ │
    │ └─────────────┘ │
    │                 │
    │ ┌─────────────┐ │
    │ │SQLite DB    │ │
    │ └─────────────┘ │
    └─────────────────┘
```

---

## 🚀 Next Steps

1. **Get Groq API Key**: https://console.groq.com (Free!)
2. **Run Backend** with your API key in `.env`
3. **Run Frontend** - `npm start` and press `w`
4. **Test Advisory**: Select crop → growth stage → click "Get Advisory"
5. **Deploy**: Push to production using Firebase, AWS, or your preferred platform

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Ensure backend is running on port 8000 |
| `GROQ_API_KEY error` | Create `.env` file in backend with your API key |
| `No advisories or alerts showing` | Check backend logs - might be rate limited or API key invalid |
| `Port 8000 already in use` | Run on different port: `--port 8001` |
| Frontend shows connection warning | Click "Retry" or ensure backend healthcheck passes |

---

## API Endpoints

**POST `/api/advisor`** - Generate advisory
```json
{
  "crop_type": "Wheat",
  "growth_stage": "flowering",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**GET `/api/crops`** - List available crops

**GET `/api/history/advisories`** - Past advisories

**GET `/api/history/alerts`** - Past risk alerts

---

## 📊 Success Metrics

✅ LLM generates contextual advisories for any crop type
✅ Advisory changes dynamically when inputs change  
✅ Risk triggers fire based on weather conditions
✅ Fungal Risk Alert (>60% rain + flowering) works perfectly
✅ Full history tracking in SQLite
✅ User-friendly mobile UI

---

## 🎉 You're All Set!

Your complete crop advisory platform is ready. The system demonstrates:
1. **Hybrid LLM + RAG Architecture** (via Groq/LLaMA 3)
2. **Autonomous Trigger System** (risk-based alerts)
3. **Real-time Weather Integration** (Open-Meteo API)
4. **Cross-platform UI** (React Native/Expo)

Happy farming! 🌾

---

*For detailed instructions, see [SETUP.md](./SETUP.md)*

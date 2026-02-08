# High Speed Quad Dashboard - Setup & Run Guide

## 1. Project Structure
The project assumes the following directory structure:
capstone2025/
├── .venv/                  # Python Virtual Environment (Top Level)
├── sw/
│   ├── Server/             # Python Backend
│   │   ├── server.py
│   │   └── config.json     # Port Configuration
│   ├── frontend/           # React Frontend
│   │   ├── package.json
│   │   ├── src/
│   │   └── public/
│   └── requirements.txt    # Python Dependencies

## 2. Initial Setup

### Backend (Python)
1. **Create Virtual Environment** (at the `capstone2025/` root level):
   # Windows
   python -m venv .venv
   
   # Mac/Linux
   python3 -m venv .venv

2. **Activate & Install Dependencies**:
   # Windows
   .venv\Scripts\activate
   pip install -r sw/requirements.txt
   
   # Mac/Linux
   source .venv/bin/activate
   pip install -r sw/requirements.txt

### Frontend (React)
1. Navigate to the frontend directory:
   cd sw/frontend

2. Install Node dependencies:
   npm install
   npm install concurrently --save-dev  # Required for the start script

---

## 3. Configuration (COM Ports)
To configure the drone connection settings without changing code, edit (or create) `sw/Server/config.json`:

{
    "port": "COM5",
    "baudrate": 420000
}
*Note: If the drone is not connected, the server will auto-retry until it is found.*

---

## 4. Running the System
We have configured a single command to launch both the Python backend (using the `.venv`) and the React frontend.

1. Open a terminal in `sw/frontend/`.
2. Run the start command:

**Windows:**
npm run startboth

---

## Dashboard Alerts

The dashboard features a **Safety Alert System** that triggers a red warning banner if the drone exceeds critical safety limits. These thresholds are defined in `src/context/TelemetryStore.jsx` and are based on the design specifications:

* **⚠️ CRITICAL: NO HEARTBEAT**: Triggered if no telemetry packet is received for **2 seconds**.
* **⚠️ LOW BATTERY**: Triggered if voltage drops below **39.6V** (3.3V per cell on 12S LiPo).
* **⚠️ HIGH CURRENT**: Triggered if current draw exceeds **280A**.
* **⚠️ POOR LINK QUALITY**: Triggered if Crossfire Link Quality (LQ) drops below **95%**.
* **⚠️ ALTITUDE WARNING**: Triggered if altitude is **below 20m** or **above 120m** (Geofence safety). *Note: This alert is only active when a valid 3D GPS fix is established.*

---
# AirCare AI

AirCare AI is a premium full-stack Air Quality Index and Smart Health Assistant web app.

## Tech Stack

- Frontend: React, Vite, Framer Motion, Recharts, React Router
- Backend: Python, Flask
- Database: SQLite SQL database

## Run The Project

Install all dependencies:

```bash
npm run install:all
```

For a simple no-payment live AQI source, create a free WAQI/AQICN API token and set it before starting:

```bash
$env:WAQI_API_TOKEN="your_waqi_token_here"
```

Token page: https://aqicn.org/data-platform/token/

Optional official India source: create a data.gov.in API key and set:

PowerShell:

```bash
$env:DATA_GOV_API_KEY="your_data_gov_key_here"
```

Command Prompt:

```bash
set DATA_GOV_API_KEY=your_data_gov_key_here
```

Optional: if you already have Google Cloud billing, you can use Google Air Quality API instead:

```bash
$env:GOOGLE_AIR_QUALITY_API_KEY="your_google_key_here"
```

Start frontend and backend together:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Folder Structure

```text
frontend/   React application
backend/    Python Flask REST API and SQLite database
```

AQI source priority: WAQI/AQICN token, then CPCB/data.gov.in, then Google Air Quality API, then Open-Meteo estimated fallback. Weather values are sourced from Open-Meteo.

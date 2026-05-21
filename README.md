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

For no-payment official India AQI, create a free data.gov.in API key and set it before starting.

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

AQI is sourced from CPCB Sameer National AQI via data.gov.in when `DATA_GOV_API_KEY` is set. Weather values are sourced from Open-Meteo.

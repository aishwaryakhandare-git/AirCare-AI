from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

load_dotenv()

CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from data import check_data_gov_connection, create_city_weather, create_suggestions, create_weekly_analytics
from database import get_connection, rows_to_dicts, setup_database
from recommendations import create_recommendations

app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "https://aircare-ai-1.onrender.com",
    ],
)

setup_database()


@app.get("/")
def home():
    return jsonify({"message": "AirCare AI Python API is running."})


@app.get("/api/debug/data-gov")
def debug_data_gov():
    return jsonify(check_data_gov_connection())


@app.get("/api/air-quality/suggestions/<query>")
def get_city_suggestions(query):
    try:
        return jsonify(create_suggestions(query))
    except Exception:
        return jsonify({"message": "Could not load live city suggestions."}), 503


@app.get("/api/air-quality/<city>")
def get_air_quality(city):
    if len(city.strip()) < 2:
        return jsonify({"message": "Please enter a city name."}), 400

    try:
        air_quality = create_city_weather(city)

    except RuntimeError as error:
        print("RUNTIME ERROR:", error)

        return jsonify({
            "message": str(error),
            "error": str(error)
        }),503


    except Exception as error:
        print("FULL ERROR:", error)

        return jsonify({
            "message": "Could not load AQI data right now. Check backend environment variables and API source access.",
            "error": str(error)
        }),503
    
    if not air_quality:
        return jsonify({"message": "Location not found."}), 404

    return jsonify(air_quality)


@app.get("/api/analytics/<city>")
def get_analytics(city):
    try:
        return jsonify(create_weekly_analytics(city))
    except Exception:
        return jsonify({"message": "Could not load live analytics data."}), 503


@app.post("/api/recommendations")
def get_recommendations():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Request body is required."}), 400

    aqi = data.get("aqi")
    temperature = data.get("temperature")
    uv_index = data.get("uvIndex")

    if aqi is None or temperature is None or uv_index is None:
        return jsonify({"message": "AQI, temperature, and UV index are required."}), 400

    return jsonify(create_recommendations(aqi, temperature, uv_index))


@app.get("/api/favorites")
def get_favorites():
    connection = get_connection()
    favorites = connection.execute(
        "SELECT * FROM favorites ORDER BY created_at DESC"
    ).fetchall()
    connection.close()

    return jsonify(rows_to_dicts(favorites))


@app.post("/api/favorites")
def add_favorite():
    data = request.get_json()
    city = data.get("city", "").strip() if data else ""

    if len(city) < 2:
        return jsonify({"message": "City name is required."}), 400

    try:
        connection = get_connection()
        cursor = connection.execute("INSERT INTO favorites (city) VALUES (?)", (city,))
        connection.commit()
        favorite_id = cursor.lastrowid
        connection.close()

        return jsonify({"id": favorite_id, "city": city}), 201
    except Exception:
        return jsonify({"message": "This city is already saved."}), 409


@app.delete("/api/favorites/<int:favorite_id>")
def remove_favorite(favorite_id):
    connection = get_connection()
    connection.execute("DELETE FROM favorites WHERE id = ?", (favorite_id,))
    connection.commit()
    connection.close()

    return jsonify({"message": "Favorite city removed."})


@app.get("/api/preferences")
def get_preferences():
    connection = get_connection()
    preferences = connection.execute("SELECT * FROM preferences WHERE id = 1").fetchone()
    connection.close()

    return jsonify(dict(preferences))


@app.put("/api/preferences")
def update_preferences():
    data = request.get_json() or {}
    theme = data.get("theme", "dark")
    temperature_unit = data.get("temperatureUnit", "c")

    connection = get_connection()
    connection.execute(
        "UPDATE preferences SET theme = ?, temperature_unit = ? WHERE id = 1",
        (theme, temperature_unit),
    )
    connection.commit()
    connection.close()

    return jsonify({"theme": theme, "temperatureUnit": temperature_unit})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

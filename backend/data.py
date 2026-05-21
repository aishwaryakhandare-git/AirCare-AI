import os
import json
import urllib.parse
import urllib.request

DATA_GOV_AQI_RESOURCE = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"
DATA_GOV_AQI_URL = f"https://api.data.gov.in/resource/{DATA_GOV_AQI_RESOURCE}"
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
GOOGLE_AIR_QUALITY_URL = "https://airquality.googleapis.com/v1/currentConditions:lookup"

INDIAN_PLACES = [
    "Delhi",
    "Mumbai",
    "Pune",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Patna",
    "Gurugram",
    "Noida",
    "Chandigarh",
    "Bhopal",
    "Indore",
    "Nagpur",
    "Surat",
    "Varanasi",
    "Visakhapatnam",
    "Coimbatore",
    "Mysuru",
    "Amritsar",
]


def fetch_json(url, params):
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(
        f"{url}?{query}",
        headers={"User-Agent": "AirCare-AI/1.0"},
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        import json

        return json.loads(response.read().decode("utf-8"))


def post_json(url, params, body):
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(
        f"{url}?{query}",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "AirCare-AI/1.0",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def title_location(place):
    parts = [place.get("name")]

    if place.get("admin1"):
        parts.append(place["admin1"])

    if place.get("country"):
        parts.append(place["country"])

    return ", ".join(part for part in parts if part)


def find_location(city):
    data = fetch_json(
        GEOCODING_URL,
        {
            "name": city,
            "count": 1,
            "language": "en",
            "format": "json",
            "countryCode": "IN",
        },
    )

    results = data.get("results", [])

    if not results:
        return None

    return results[0]


def create_suggestions(query):
    search = query.strip().lower()

    if len(search) < 2:
        return []

    matches = []
    for place in INDIAN_PLACES:
        if place.lower().startswith(search) or search in place.lower():
            matches.append(place)

    return matches[:8]


def get_aqi_status(aqi):
    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Satisfactory"
    if aqi <= 200:
        return "Moderately Polluted"
    if aqi <= 300:
        return "Poor"
    if aqi <= 400:
        return "Very Poor"
    return "Severe"


def calculate_heat_index(temperature, humidity):
    return round(temperature + (0.05 * humidity))


def number_from_record(record, possible_keys):
    for key in possible_keys:
        value = record.get(key)

        if value in (None, "", "NA", "None"):
            continue

        try:
            return float(value)
        except ValueError:
            continue

    return None


def text_from_record(record, possible_keys, default="N/A"):
    for key in possible_keys:
        value = record.get(key)

        if value not in (None, "", "NA", "None"):
            return str(value)

    return default


def fetch_data_gov_air_quality(city):
    api_key = os.getenv("DATA_GOV_API_KEY")

    print("KEY EXISTS:", bool(api_key))

    data = fetch_json(
        DATA_GOV_AQI_URL,
        {
            "api-key": api_key,
            "format": "json",
            "limit": 1000
        },
    )

    print("KEY EXISTS:", bool(api_key))

    print("RESOURCE:", DATA_GOV_AQI_RESOURCE)
    print("FULL RESPONSE:")
    print(data)

    records = data.get("records", [])

    print("Total records:", len(records))

    if records:
        print("First record:", records[0])

    city_records = []

    for record in records:

        record_city = str(
            record.get("city","")
        ).lower()

        if city.strip().lower() in record_city:

            city_records.append(record)

    records = city_records

    if not records:
        raise RuntimeError("Official CPCB AQI was not available for this city.")

    aqi_values = []
    stations = set()
    pollutants = {}
    dominant_pollutants = []
    last_update = None

    for record in records:
        pollutant_average = number_from_record(
        record,
        ["avg_value"]
    )

    if pollutant_average is not None:
        aqi_values.append(pollutant_average)
        pollutant = text_from_record(record, ["prominent_pollutant", "pollutant_id", "pollutant", "Prominent Pollutant"])
        station = text_from_record(record, ["station", "station_name", "Station", "monitoring_station"], "")
        updated = text_from_record(record, ["last_update", "Last Update", "last_updated", "updated_at"], "")
        pollutant_average = number_from_record(record, ["pollutant_avg", "avg_value", "average", "value"])

        if station:
            stations.add(station)

        if pollutant and pollutant != "N/A":
            dominant_pollutants.append(pollutant)

        if updated:
            last_update = updated

        if pollutant != "N/A" and pollutant_average is not None:
            pollutants[pollutant.lower()] = pollutant_average

    if not aqi_values:
        raise RuntimeError("Official CPCB AQI value was not available for this city.")

    city_aqi = round(sum(aqi_values) / len(aqi_values))

    return {
        "aqi": city_aqi,
        "displayName": "India National AQI",
        "dominantPollutant": dominant_pollutants[0] if dominant_pollutants else "N/A",
        "category": get_aqi_status(city_aqi),
        "stationName": f"{len(stations) or len(records)} official monitoring station(s) averaged",
        "updatedAt": last_update,
        "pollutants": {
            "pm25": pollutants.get("pm2.5") or pollutants.get("pm25"),
            "pm10": pollutants.get("pm10"),
            "co": pollutants.get("co"),
            "no2": pollutants.get("no2"),
            "o3": pollutants.get("o3"),
            "so2": pollutants.get("so2"),
        },
        "source": "CPCB Sameer National AQI via data.gov.in",
    }


def fetch_google_air_quality(latitude, longitude):
    api_key = os.getenv("GOOGLE_AIR_QUALITY_API_KEY")

    if not api_key:
        raise RuntimeError("GOOGLE_AIR_QUALITY_API_KEY is missing.")

    data = post_json(
        GOOGLE_AIR_QUALITY_URL,
        {"key": api_key},
        {
            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },
            "extraComputations": [
                "LOCAL_AQI",
                "DOMINANT_POLLUTANT_CONCENTRATION",
                "POLLUTANT_CONCENTRATION",
                "HEALTH_RECOMMENDATIONS",
            ],
            "universalAqi": False,
            "languageCode": "en",
        },
    )

    indexes = data.get("indexes", [])
    local_index = indexes[0] if indexes else None

    if not local_index:
        raise RuntimeError("Google local AQI was not available for this city.")

    pollutants = {}
    for pollutant in data.get("pollutants", []):
        code = pollutant.get("code", "").lower()
        concentration = pollutant.get("concentration", {})
        pollutants[code] = concentration.get("value")

    return {
        "aqi": local_index.get("aqi"),
        "displayName": local_index.get("displayName"),
        "dominantPollutant": local_index.get("dominantPollutant", "N/A").upper(),
        "category": local_index.get("category"),
        "updatedAt": data.get("dateTime"),
        "pollutants": {
            "pm25": pollutants.get("pm2.5") or pollutants.get("pm25"),
            "pm10": pollutants.get("pm10"),
            "co": pollutants.get("co"),
            "no2": pollutants.get("no2"),
            "o3": pollutants.get("o3"),
            "so2": pollutants.get("so2"),
        },
    }


def fetch_best_air_quality(city, latitude, longitude):
    if os.getenv("DATA_GOV_API_KEY"):
        return fetch_data_gov_air_quality(city)

    if os.getenv("GOOGLE_AIR_QUALITY_API_KEY"):
        return fetch_google_air_quality(latitude, longitude)

    raise RuntimeError("DATA_GOV_API_KEY is missing. Use a free data.gov.in key, or use GOOGLE_AIR_QUALITY_API_KEY if you have Google billing.")


def create_city_weather(city):
    place = find_location(city)

    if not place:
        return None

    latitude = place["latitude"]
    longitude = place["longitude"]

    weather = fetch_json(
        WEATHER_URL,
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index",
            "timezone": "auto",
        },
    )

    air_quality = fetch_best_air_quality(city, latitude, longitude)
    current_weather = weather.get("current", {})
    temperature = current_weather.get("temperature_2m") or 0
    humidity = current_weather.get("relative_humidity_2m") or 0

    return {
        "city": title_location(place),
        "latitude": latitude,
        "longitude": longitude,
        "aqi": air_quality["aqi"],
        "aqiStandard": air_quality["displayName"],
        "dominantPollutant": air_quality["dominantPollutant"],
        "stationName": air_quality["stationName"],
        "status": air_quality["category"] or get_aqi_status(air_quality["aqi"]),
        "temperature": round(temperature),
        "humidity": round(humidity),
        "uvIndex": round(current_weather.get("uv_index") or 0),
        "windSpeed": round(current_weather.get("wind_speed_10m") or 0),
        "heatIndex": round(current_weather.get("apparent_temperature") or calculate_heat_index(temperature, humidity)),
        "pollutants": air_quality["pollutants"],
        "source": f"{air_quality['source']} + Open-Meteo weather",
        "updatedAt": air_quality["updatedAt"] or current_weather.get("time"),
    }


def create_weekly_analytics(city):
    place = find_location(city)

    if not place:
        return []

    latitude = place["latitude"]
    longitude = place["longitude"]

    weather = fetch_json(
        WEATHER_URL,
        {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": "temperature_2m,uv_index",
            "forecast_days": 7,
            "timezone": "auto",
        },
    )

    weather_hourly = weather.get("hourly", {})
    weather_times = weather_hourly.get("time", [])
    temperatures = weather_hourly.get("temperature_2m", [])
    uv_values = weather_hourly.get("uv_index", [])

    results = []

    for day_index in range(7):
        hour_index = day_index * 24 + 12

        if hour_index >= len(weather_times):
            break

        results.append(
            {
                "day": weather_times[hour_index][5:10],
                "aqi": 0,
                "temperature": round(temperatures[hour_index] or 0),
                "uv": round(uv_values[hour_index] or 0),
            }
        )

    return results

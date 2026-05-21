city_seeds = {
    "agra": 128,
    "ahmedabad": 142,
    "amritsar": 166,
    "bengaluru": 58,
    "bhopal": 94,
    "chandigarh": 82,
    "chennai": 104,
    "coimbatore": 54,
    "delhi": 185,
    "gurugram": 188,
    "hyderabad": 88,
    "indore": 86,
    "jaipur": 146,
    "kolkata": 132,
    "lucknow": 158,
    "mumbai": 92,
    "mysuru": 46,
    "nagpur": 116,
    "noida": 176,
    "patna": 164,
    "pune": 72,
    "surat": 118,
    "varanasi": 154,
    "visakhapatnam": 62,
    "berlin": 51,
    "dubai": 112,
    "london": 48,
    "madrid": 67,
    "new york": 73,
    "paris": 64,
    "singapore": 43,
    "sydney": 39,
    "tokyo": 55,
    "toronto": 44,
}


def normalize_city(city):
    return city.strip().lower()


def title_case(city):
    words = city.strip().split()
    return " ".join(word.capitalize() for word in words)


def get_seed(city):
    normalized_city = normalize_city(city)

    if normalized_city in city_seeds:
        return city_seeds[normalized_city]

    total = 0
    for letter in normalized_city:
        total += ord(letter)

    return 45 + (total % 170)


def get_aqi_status(aqi):
    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Moderate"
    if aqi <= 200:
        return "Poor"
    return "Severe"


def create_city_weather(city):
    seed = get_seed(city)
    temperature = 20 + (seed % 18)
    humidity = 38 + (seed % 45)

    return {
        "city": title_case(city),
        "aqi": seed,
        "status": get_aqi_status(seed),
        "temperature": temperature,
        "humidity": humidity,
        "uvIndex": 2 + (seed % 9),
        "windSpeed": 5 + (seed % 24),
        "heatIndex": round(temperature + humidity * 0.05),
    }


def create_weekly_analytics(city):
    import math

    seed = get_seed(city)
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    results = []

    for index, day in enumerate(days):
        wave = math.sin(index + seed / 20)

        results.append(
            {
                "day": day,
                "aqi": max(25, round(seed + wave * 26 - index * 3)),
                "temperature": round(22 + (seed % 13) + wave * 3),
                "uv": max(1, round(4 + (seed % 4) + wave * 2)),
            }
        )

    return results


def create_suggestions(query):
    search = normalize_city(query)

    if len(search) < 2:
        return []

    matching_cities = []
    for city in city_seeds:
        if city.startswith(search) or search in city:
            matching_cities.append(city)

    matching_cities.sort(key=lambda city: (0 if city.startswith(search) else 1, city))
    return [title_case(city) for city in matching_cities[:8]]

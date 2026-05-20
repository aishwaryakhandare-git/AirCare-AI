const citySeeds = {
  delhi: 185,
  mumbai: 92,
  bengaluru: 58,
  chennai: 104,
  hyderabad: 88,
  kolkata: 132,
  pune: 72,
  jaipur: 146,
  london: 48,
  paris: 64,
  tokyo: 55,
  "new york": 73
};

function normalizeCity(city) {
  return city.trim().toLowerCase();
}

function getSeed(city) {
  const normalizedCity = normalizeCity(city);

  if (citySeeds[normalizedCity]) {
    return citySeeds[normalizedCity];
  }

  let total = 0;
  for (let index = 0; index < normalizedCity.length; index += 1) {
    total += normalizedCity.charCodeAt(index);
  }

  return 45 + (total % 170);
}

export function getAqiStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  return "Severe";
}

export function createCityWeather(city) {
  const seed = getSeed(city);
  const aqi = seed;
  const temperature = 20 + (seed % 18);
  const humidity = 38 + (seed % 45);
  const uvIndex = 2 + (seed % 9);
  const windSpeed = 5 + (seed % 24);
  const heatIndex = Math.round(temperature + humidity * 0.05);

  return {
    city: city.trim(),
    aqi,
    status: getAqiStatus(aqi),
    temperature,
    humidity,
    uvIndex,
    windSpeed,
    heatIndex
  };
}

export function createWeeklyAnalytics(city) {
  const seed = getSeed(city);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days.map((day, index) => {
    const wave = Math.sin(index + seed / 20);

    return {
      day,
      aqi: Math.max(25, Math.round(seed + wave * 26 - index * 3)),
      temperature: Math.round(22 + (seed % 13) + wave * 3),
      uv: Math.max(1, Math.round(4 + (seed % 4) + wave * 2))
    };
  });
}

export function createSuggestions(query) {
  const search = normalizeCity(query);

  return Object.keys(citySeeds)
    .filter((city) => city.includes(search))
    .slice(0, 5)
    .map((city) =>
      city
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ")
    );
}

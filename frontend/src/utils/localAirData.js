const citySeeds = {
  agra: 128,
  ahmedabad: 142,
  amritsar: 166,
  bengaluru: 58,
  bhopal: 94,
  chandigarh: 82,
  chennai: 104,
  coimbatore: 54,
  delhi: 185,
  gurugram: 188,
  hyderabad: 88,
  indore: 86,
  jaipur: 146,
  kolkata: 132,
  lucknow: 158,
  mumbai: 92,
  mysuru: 46,
  nagpur: 116,
  noida: 176,
  patna: 164,
  pune: 72,
  surat: 118,
  varanasi: 154,
  visakhapatnam: 62,
  berlin: 51,
  dubai: 112,
  london: 48,
  madrid: 67,
  "new york": 73,
  paris: 64,
  singapore: 43,
  sydney: 39,
  tokyo: 55,
  toronto: 44
};

function normalizeCity(city) {
  return city.trim().toLowerCase();
}

function titleCase(city) {
  return city
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

function getAqiStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  return "Severe";
}

export function createLocalAirData(city) {
  const seed = getSeed(city);
  const temperature = 20 + (seed % 18);
  const humidity = 38 + (seed % 45);

  return {
    city: titleCase(city),
    aqi: seed,
    status: getAqiStatus(seed),
    temperature,
    humidity,
    uvIndex: 2 + (seed % 9),
    windSpeed: 5 + (seed % 24),
    heatIndex: Math.round(temperature + humidity * 0.05)
  };
}

export function getLocalSuggestions(query) {
  const search = normalizeCity(query);

  if (search.length < 2) {
    return [];
  }

  return Object.keys(citySeeds)
    .filter((city) => city.startsWith(search) || city.includes(search))
    .sort((firstCity, secondCity) => {
      const firstStarts = firstCity.startsWith(search) ? 0 : 1;
      const secondStarts = secondCity.startsWith(search) ? 0 : 1;
      return firstStarts - secondStarts || firstCity.localeCompare(secondCity);
    })
    .slice(0, 8)
    .map(titleCase);
}

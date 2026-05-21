import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Droplets, Search, Sun, Thermometer, Wind } from "lucide-react";
import { api } from "../api.js";
import AqiOrb from "../components/AqiOrb.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Loader from "../components/Loader.jsx";
import StatCard from "../components/StatCard.jsx";
import { createLocalAirData, getLocalSuggestions } from "../utils/localAirData.js";

function Dashboard() {
  const [city, setCity] = useState("Delhi");
  const [query, setQuery] = useState("Delhi");
  const [airData, setAirData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAirQuality(cityName) {
    const cleanCity = cityName.trim();

    if (cleanCity.length < 2) {
      toast.error("Please enter at least 2 letters.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/air-quality/${encodeURIComponent(cleanCity)}`);
      setAirData(response.data);
      setCity(response.data.city);
    } catch (error) {
      const localData = createLocalAirData(cleanCity);
      setAirData(localData);
      setCity(localData.city);
      toast.success("Showing demo AQI data. Start the backend for saved favorites.");
    } finally {
      setLoading(false);
    }
  }

  async function saveFavorite() {
    try {
      await api.post("/favorites", { city });
      toast.success(`${city} saved to favorites.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save city.");
    }
  }

  async function handleSuggestionSearch(text) {
    setQuery(text);

    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await api.get(`/air-quality/suggestions/${encodeURIComponent(text)}`);
      setSuggestions(response.data);
    } catch (error) {
      setSuggestions(getLocalSuggestions(text));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchAirQuality(query);
    setSuggestions([]);
  }

  useEffect(() => {
    fetchAirQuality("Delhi");
  }, []);

  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">AQI Dashboard</p>
        <h2>Search your city</h2>
      </div>

      <form className="search-bar" onSubmit={handleSubmit}>
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => handleSuggestionSearch(event.target.value)}
          placeholder="Search city or location"
          autoComplete="off"
        />
        <button className="primary-btn" type="submit">Search</button>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((item) => (
              <button key={item} type="button" onClick={() => {
                setQuery(item);
                fetchAirQuality(item);
                setSuggestions([]);
              }}>
                {item}
              </button>
            ))}
          </div>
        )}
      </form>

      {loading && <Loader />}

      {airData && !loading && (
        <div className="dashboard-grid">
          <GlassCard className="dashboard-orb">
            <h3>{airData.city}</h3>
            <AqiOrb value={airData.aqi} status={airData.status} />
            <button className="ghost-btn" onClick={saveFavorite}>Save Favorite</button>
          </GlassCard>

          <div className="metric-grid">
            <StatCard icon={<Thermometer />} label="Temperature" value={`${airData.temperature}°C`} />
            <StatCard icon={<Droplets />} label="Humidity" value={`${airData.humidity}%`} />
            <StatCard icon={<Sun />} label="UV Index" value={airData.uvIndex} />
            <StatCard icon={<Wind />} label="Wind Speed" value={`${airData.windSpeed} km/h`} />
            <StatCard icon={<Thermometer />} label="Heat Index" value={`${airData.heatIndex}°C`} />
            <StatCard icon={<Wind />} label="AQI Status" value={airData.status} tone={airData.status.toLowerCase()} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

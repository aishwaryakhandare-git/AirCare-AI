import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api.js";
import GlassCard from "../components/GlassCard.jsx";

function Analytics() {
  const [city, setCity] = useState("Delhi");
  const [data, setData] = useState([]);

  async function loadAnalytics(cityName) {
    const response = await api.get(`/analytics/${cityName}`);
    setData(response.data);
  }

  useEffect(() => {
    loadAnalytics("Delhi");
  }, []);

  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">Analytics</p>
        <h2>Weekly air and weather trends</h2>
      </div>

      <form className="search-bar" onSubmit={(event) => {
        event.preventDefault();
        loadAnalytics(city);
      }}>
        <input value={city} onChange={(event) => setCity(event.target.value)} />
        <button className="primary-btn">Update</button>
      </form>

      <div className="chart-grid">
        <GlassCard>
          <h3>Weekly AQI Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="aqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#63e6be" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#63e6be" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="aqi" stroke="#63e6be" fill="url(#aqi)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3>Temperature and UV Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#ffb86c" strokeWidth={3} />
              <Line type="monotone" dataKey="uv" stroke="#8be9fd" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}

export default Analytics;

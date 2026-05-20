import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Activity, HeartPulse } from "lucide-react";
import { api } from "../api.js";
import GlassCard from "../components/GlassCard.jsx";
import Loader from "../components/Loader.jsx";

function Recommendations() {
  const [form, setForm] = useState({ aqi: 92, temperature: 31, uvIndex: 7 });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getRecommendations(currentForm = form) {
    try {
      setLoading(true);
      const response = await api.post("/recommendations", currentForm);
      setRecommendations(response.data);
    } catch (error) {
      toast.error("Could not generate recommendations.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm({ ...form, [field]: Number(value) });
  }

  useEffect(() => {
    getRecommendations(form);
  }, []);

  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">Smart Health Assistant</p>
        <h2>Personal recommendations</h2>
      </div>

      <GlassCard className="health-form">
        <label>
          AQI
          <input type="number" value={form.aqi} onChange={(event) => updateField("aqi", event.target.value)} />
        </label>
        <label>
          Temperature
          <input type="number" value={form.temperature} onChange={(event) => updateField("temperature", event.target.value)} />
        </label>
        <label>
          UV Index
          <input type="number" value={form.uvIndex} onChange={(event) => updateField("uvIndex", event.target.value)} />
        </label>
        <button className="primary-btn" onClick={() => getRecommendations()}>Generate</button>
      </GlassCard>

      {loading && <Loader />}

      <div className="recommendation-grid">
        {recommendations.map((item, index) => (
          <GlassCard key={item.title} delay={index * 0.04}>
            {index % 2 === 0 ? <HeartPulse /> : <Activity />}
            <h3>{item.title}</h3>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;

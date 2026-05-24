import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { motion } from "framer-motion";
import { BrainCircuit, Gauge, ShieldCheck, Wind } from "lucide-react";
import AqiOrb from "../components/AqiOrb.jsx";
import GlassCard from "../components/GlassCard.jsx";
import StatCard from "../components/StatCard.jsx";

function Landing() {

  const location = useLocation();

 const [heroData, setHeroData] = useState({
    aqi: localStorage.getItem("lastCity") ? null : "🌿",
    status: localStorage.getItem("lastCity")
      ? "Welcome"
      : "Healthy Air Starts Here",
    city: "",
    message: localStorage.getItem("lastCity")
      ? "Search a city for personalized air insights"
      : "Breathe cleaner, live healthier 🌱"
  });


  useEffect(() => {

    async function loadLastCity() {

      const savedCity =
        localStorage.getItem("lastCity");

      console.log("Saved:", savedCity);

      if (!savedCity) return;

      try {

        const response =
          await api.get(
            `/air-quality/${savedCity}`
          );

        let healthMessage = "";

        if (response.data.aqi <= 50) {
          healthMessage = "Air looks clean today. Great for outdoor activities.";
        }
        else if (response.data.aqi <= 100) {
          healthMessage = "Air quality is acceptable. Normal outdoor activity is okay.";
        }
        else if (response.data.aqi <= 150) {
          healthMessage = "Sensitive groups should reduce long outdoor exposure.";
        }
        else if (response.data.aqi <= 200) {
          healthMessage = "Consider wearing a mask outdoors.";
        }
        else {
          healthMessage = "Poor air quality detected. Limit outdoor activity.";
        }

        setHeroData({
          aqi: response.data.aqi,
          status: response.data.status,
          city: response.data.city,
          message: healthMessage
        });

      } catch(error){
        console.log(error);
      }
    }

    loadLastCity();

  }, [location.pathname]);

  return (
    <div>
      <section className="hero-section">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Smart air intelligence for healthier days
          </motion.p>
          <h1>AirCare AI</h1>
          <p>
            {heroData.city &&
            `Last checked: ${heroData.city}`}
          </p>

          <p className="hero-text">
            {heroData.message}
          </p>
         
          <div className="hero-actions">
            <Link className="primary-btn" to="/dashboard">Open Dashboard</Link>
            <Link className="ghost-btn" to="/recommendations">View Health Tips</Link>
          </div>
        </div>
        <div className="hero-visual">
          <AqiOrb
            value={heroData.aqi}
            status={heroData.status}
          />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          icon={<Gauge />}
          label="Live AQI"
          value={heroData.aqi}
          tone="good"
        />
        <StatCard icon={<Wind />} label="Wind Speed" value="18 km/h" />
        <StatCard icon={<ShieldCheck />} label="Health Score" value="84%" tone="good" />
      </section>

      <section className="feature-grid">
        <GlassCard>
          <BrainCircuit />
          <h3>AI Health Guidance</h3>
          <p>Simple recommendations for masks, sunscreen, hydration, and safe outdoor activity.</p>
        </GlassCard>
        <GlassCard delay={0.08}>
          <Gauge />
          <h3>Air Quality Dashboard</h3>
          <p>Search any city and see AQI, temperature, humidity, UV, wind, and heat index.</p>
        </GlassCard>
        <GlassCard delay={0.16}>
          <Wind />
          <h3>Weekly Trends</h3>
          <p>Understand air and weather movement through clean analytics charts.</p>
        </GlassCard>
      </section>
    </div>
  );
}

export default Landing;

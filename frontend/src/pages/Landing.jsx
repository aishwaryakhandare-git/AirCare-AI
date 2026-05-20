import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainCircuit, Gauge, ShieldCheck, Wind } from "lucide-react";
import AqiOrb from "../components/AqiOrb.jsx";
import GlassCard from "../components/GlassCard.jsx";
import StatCard from "../components/StatCard.jsx";

function Landing() {
  return (
    <div>
      <section className="hero-section">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Smart air intelligence for healthier days
          </motion.p>
          <h1>AirCare AI</h1>
          <p className="hero-text">
            Track air quality, weather stress, UV exposure, and personal health guidance in one clean dashboard.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/dashboard">Open Dashboard</Link>
            <Link className="ghost-btn" to="/recommendations">View Health Tips</Link>
          </div>
        </div>
        <div className="hero-visual">
          <AqiOrb value={72} status="Moderate" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={<Gauge />} label="Live AQI" value="72" tone="good" />
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

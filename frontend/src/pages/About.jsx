import React from "react";
import { Leaf, ShieldCheck, Wind } from "lucide-react";
import GlassCard from "../components/GlassCard.jsx";

function About() {
  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">About AirCare AI</p>
        <h2>Cleaner decisions for everyday life</h2>
      </div>

      <div className="about-grid">
        <GlassCard>
          <Wind />
          <h3>What AQI means</h3>
          <p>
            AQI is a simple score that explains how clean or polluted the air is. Lower values are healthier.
          </p>
        </GlassCard>
        <GlassCard>
          <ShieldCheck />
          <h3>Health impact</h3>
          <p>
            Poor air quality can affect breathing, energy, sleep, exercise, and sensitive health conditions.
          </p>
        </GlassCard>
        <GlassCard>
          <Leaf />
          <h3>Project purpose</h3>
          <p>
            AirCare AI helps users understand air conditions and take practical action before stepping outside.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

export default About;

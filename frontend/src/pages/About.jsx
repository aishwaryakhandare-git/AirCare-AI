import React from "react";
import {
  Leaf,
  ShieldCheck,
  Wind,
  Thermometer,
  Sun,
  Activity
} from "lucide-react";

import GlassCard from "../components/GlassCard.jsx";

function About() {
  return (
    <div>

      <div className="section-heading">
        <p className="eyebrow">
          About AirCare AI
        </p>

        <h2>
          Understand your air quality and health insights
        </h2>
      </div>

      <div className="about-grid">

        <GlassCard>
          <Wind />
          <h3>What is AQI?</h3>

          <p>
            AQI (Air Quality Index) measures how
            clean or polluted the air is.
            Lower AQI values indicate cleaner
            air while higher values indicate
            greater health risks.
          </p>

        </GlassCard>

        <GlassCard>
          <ShieldCheck />
          <h3>AQI Categories</h3>

          <p>
            🟢 0–50 → Good <br/>
            🟡 51–100 → Satisfactory <br/>
            🟠 101–200 → Moderate <br/>
            🔴 201–300 → Poor <br/>
            🟣 301–400 → Very Poor <br/>
            ⚫ 401–500 → Severe
          </p>

        </GlassCard>

        <GlassCard>
          <Leaf />
          <h3>Health Impact</h3>

          <p>
            Poor air quality may affect
            breathing, sleep, exercise,
            energy levels and people with
            asthma or respiratory conditions.
          </p>

        </GlassCard>

        <GlassCard>
          <Thermometer />
          <h3>Temperature & Heat Index</h3>

          <p>
            Temperature shows the current
            weather temperature while Heat
            Index tells how hot it actually
            feels after considering humidity.
          </p>

        </GlassCard>

        <GlassCard>
          <Sun />
          <h3>UV Index</h3>

          <p>
            UV Index measures ultraviolet
            radiation from sunlight.
            Higher values increase the risk
            of skin damage and heat stress.
          </p>

        </GlassCard>

        <GlassCard>
          <Activity />
          <h3>Common Pollutants</h3>

          <p>
            PM2.5 → Fine particles <br/>
            PM10 → Dust & smoke <br/>
            CO → Carbon monoxide <br/>
            NO₂ → Vehicle emissions <br/>
            O₃ → Ground ozone
          </p>

        </GlassCard>

      </div>

    </div>
  );
}

export default About;
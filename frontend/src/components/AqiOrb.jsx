import React from "react";
import { motion } from "framer-motion";

function AqiOrb({ value = 72, status = "Moderate" }) {
  return (
    <div className={`aqi-orb ${status.toLowerCase()}`}>
      <motion.div
        className="orb-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="orb-core"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span>AQI</span>
        <strong>{value}</strong>
        <small>{status}</small>
      </motion.div>
    </div>
  );
}

export default AqiOrb;

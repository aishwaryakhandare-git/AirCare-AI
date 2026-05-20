import { motion } from "framer-motion";

function StatCard({ icon, label, value, tone = "" }) {
  return (
    <motion.div className={`stat-card ${tone}`} whileHover={{ y: -4 }}>
      <span className="stat-icon">{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </motion.div>
  );
}

export default StatCard;

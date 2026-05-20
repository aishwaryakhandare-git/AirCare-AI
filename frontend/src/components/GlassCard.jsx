import { motion } from "framer-motion";

function GlassCard({ children, className = "", delay = 0 }) {
  return (
    <motion.section
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -5, scale: 1.01 }}
    >
      {children}
    </motion.section>
  );
}

export default GlassCard;

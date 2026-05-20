import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Favorites from "./pages/Favorites.jsx";
import Analytics from "./pages/Analytics.jsx";
import About from "./pages/About.jsx";

function App() {
  const [theme, setTheme] = useState("dark");
  const location = useLocation();

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app-shell">
      <div className="airflow-bg">
        <span />
        <span />
        <span />
      </div>
      <Navbar theme={theme} setTheme={setTheme} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="page-wrap"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Toaster position="top-right" toastOptions={{ className: "toast" }} />
    </div>
  );
}

export default App;

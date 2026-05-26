import { Link, NavLink } from "react-router-dom";
import React from "react";
import { Activity, BarChart3, HeartPulse, Home, Info, MapPin, Moon, Sun } from "lucide-react";

const links = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: Activity },
  { path: "/recommendations", label: "Health", icon: HeartPulse },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/favorites", label: "Favorites", icon: MapPin },
  { path: "/about", label: "About", icon: Info }
];

function Navbar({ theme, setTheme }) {
  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">A</span>
        <span>AirCare AI</span>
      </Link>

      <nav className="nav-links">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} className="nav-link">
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="icon-button" onClick={toggleTheme} aria-label="Toggle color mode">
        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </button>
    </header>
  );
}

export default Navbar;

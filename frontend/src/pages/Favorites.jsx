import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Trash2 } from "lucide-react";
import { api } from "../api.js";
import GlassCard from "../components/GlassCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFavorites() {
    const response = await api.get("/favorites");
    setFavorites(response.data);
    setLoading(false);
  }

  async function removeFavorite(id) {
    await api.delete(`/favorites/${id}`);
    toast.success("Favorite removed.");
    fetchFavorites();
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">Saved Locations</p>
        <h2>Favorite cities</h2>
      </div>

      {loading && (
        <div className="favorite-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <GlassCard>
          <h3>No favorites yet</h3>
          <p>Save a city from the dashboard to see it here.</p>
        </GlassCard>
      )}

      <div className="favorite-grid">
        {favorites.map((favorite) => (
          <GlassCard key={favorite.id}>
            <MapPin />
            <h3>{favorite.city}</h3>
            <p>Saved city profile for fast air quality checks.</p>
            <button className="danger-btn" onClick={() => removeFavorite(favorite.id)}>
              <Trash2 size={17} />
              Remove
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default Favorites;

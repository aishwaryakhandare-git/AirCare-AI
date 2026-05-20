import express from "express";
import cors from "cors";
import { setupDatabase } from "./db.js";
import airQualityRoutes from "./routes/airQualityRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";

const app = express();
const PORT = 5000;

setupDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ message: "AirCare AI API is running." });
});

app.use("/api/air-quality", airQualityRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/preferences", preferenceRoutes);

app.listen(PORT, () => {
  console.log(`AirCare AI backend running on http://localhost:${PORT}`);
});

import express from "express";
import { createRecommendations } from "../services/recommendations.js";

const router = express.Router();

router.post("/", (request, response) => {
  const { aqi, temperature, uvIndex } = request.body;

  if (aqi === undefined || temperature === undefined || uvIndex === undefined) {
    response.status(400).json({ message: "AQI, temperature, and UV index are required." });
    return;
  }

  response.json(createRecommendations({ aqi, temperature, uvIndex }));
});

export default router;

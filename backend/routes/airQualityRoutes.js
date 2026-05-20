import express from "express";
import { createCityWeather, createSuggestions } from "../data/mockAirQuality.js";

const router = express.Router();

router.get("/:city", (request, response) => {
  const { city } = request.params;

  if (!city || city.trim().length < 2) {
    response.status(400).json({ message: "Please enter a city name." });
    return;
  }

  response.json(createCityWeather(city));
});

router.get("/suggestions/:query", (request, response) => {
  response.json(createSuggestions(request.params.query));
});

export default router;

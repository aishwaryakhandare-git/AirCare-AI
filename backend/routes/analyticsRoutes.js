import express from "express";
import { createWeeklyAnalytics } from "../data/mockAirQuality.js";

const router = express.Router();

router.get("/:city", (request, response) => {
  response.json(createWeeklyAnalytics(request.params.city));
});

export default router;

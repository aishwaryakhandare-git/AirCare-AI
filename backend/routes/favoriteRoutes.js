import express from "express";
import { allQuery, runQuery } from "../db.js";

const router = express.Router();

router.get("/", async (request, response) => {
  const favorites = await allQuery("SELECT * FROM favorites ORDER BY created_at DESC");
  response.json(favorites);
});

router.post("/", async (request, response) => {
  const { city } = request.body;

  if (!city || city.trim().length < 2) {
    response.status(400).json({ message: "City name is required." });
    return;
  }

  try {
    const result = await runQuery("INSERT INTO favorites (city) VALUES (?)", [city.trim()]);
    response.status(201).json({ id: result.id, city: city.trim() });
  } catch (error) {
    response.status(409).json({ message: "This city is already saved." });
  }
});

router.delete("/:id", async (request, response) => {
  await runQuery("DELETE FROM favorites WHERE id = ?", [request.params.id]);
  response.json({ message: "Favorite city removed." });
});

export default router;

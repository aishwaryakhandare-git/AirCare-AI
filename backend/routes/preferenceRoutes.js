import express from "express";
import { getQuery, runQuery } from "../db.js";

const router = express.Router();

router.get("/", async (request, response) => {
  const preferences = await getQuery("SELECT * FROM preferences WHERE id = 1");
  response.json(preferences);
});

router.put("/", async (request, response) => {
  const { theme, temperatureUnit } = request.body;

  await runQuery(
    "UPDATE preferences SET theme = ?, temperature_unit = ? WHERE id = 1",
    [theme || "dark", temperatureUnit || "c"]
  );

  response.json({ theme: theme || "dark", temperatureUnit: temperatureUnit || "c" });
});

export default router;

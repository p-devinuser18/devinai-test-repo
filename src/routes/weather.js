const express = require("express");
const router = express.Router();

router.get("/:city", async (req, res) => {
  const { city } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;
  const params = new URLSearchParams({
    q: city,
    appid: apiKey,
    units: "metric",
  });
  const url = `https://api.openweathermap.org/data/2.5/weather?${params}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }

    if (!response.ok) {
      return res.status(502).json({ error: "Weather service unavailable" });
    }

    const data = await response.json();

    return res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    });
  } catch (err) {
    if (err.name === "AbortError" || err.name === "TimeoutError") {
      return res.status(502).json({ error: "Weather service unavailable" });
    }
    return res.status(502).json({ error: "Weather service unavailable" });
  }
});

module.exports = router;

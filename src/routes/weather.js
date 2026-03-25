const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

router.get("/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      if (response.status === 404) {
        logger.info("Request handled", { method: req.method, path: req.originalUrl, statusCode: 404 });
        return res.status(404).json({ error: "City not found" });
      }
      logger.info("Request handled", { method: req.method, path: req.originalUrl, statusCode: 502 });
      return res.status(502).json({ error: "Weather service unavailable" });
    }

    const data = await response.json();

    logger.info("Request handled", { method: req.method, path: req.originalUrl, statusCode: 200 });
    return res.status(200).json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    });
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      logger.info("Request handled", { method: req.method, path: req.originalUrl, statusCode: 502 });
      return res.status(502).json({ error: "Weather service unavailable" });
    }
    logger.info("Request handled", { method: req.method, path: req.originalUrl, statusCode: 502 });
    return res.status(502).json({ error: "Weather service unavailable" });
  }
});

module.exports = router;

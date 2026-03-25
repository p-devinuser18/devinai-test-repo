const express = require("express");
const router = express.Router();
const products = require("../data/products.json");
const logger = require("../utils/logger");

router.get("/", (req, res) => {
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;
  res.json(filtered);
  logger.info("Request handled", { method: req.method, path: req.originalUrl, statusCode: res.statusCode });
});

module.exports = router;

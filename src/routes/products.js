const express = require("express");
const path = require("path");
const router = express.Router();
const products = require(path.join(__dirname, "../data/products.json"));

router.get("/", (req, res) => {
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;
  res.json(filtered);
});

module.exports = router;

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
  );
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;
  res.json(filtered);
});

module.exports = router;

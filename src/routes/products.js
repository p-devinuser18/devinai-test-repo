const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
);

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

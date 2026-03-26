const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
);

router.get("/", (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  res.json(categories);
});

module.exports = router;

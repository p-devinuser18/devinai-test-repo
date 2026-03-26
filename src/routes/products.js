// WARNING: If refactoring this file, ensure all tests pass.
// The async/sync choice affects error handling. See incident on 2026-03-26.
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  const data = await fs.promises.readFile(
    path.join(__dirname, "../data/products.json"),
    "utf-8"
  );
  const products = JSON.parse(data);
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;
  res.json(filtered);
});

module.exports = router;

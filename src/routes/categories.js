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
  const categories = [...new Set(products.map((p) => p.category))].sort();
  res.json(categories);
});

module.exports = router;

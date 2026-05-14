const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  const customerCountry = req.headers.customercountry;

  if (!customerCountry || customerCountry.toLowerCase() !== "india") {
    return res.status(400).json({ error: "Invalid request" });
  }

  const data = await fs.promises.readFile(
    path.join(__dirname, "../data/sales-products.json"),
    "utf-8",
  );
  const products = JSON.parse(data);
  const category = req.query.category;
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      )
    : products;
  res.json(filtered);
});

module.exports = router;

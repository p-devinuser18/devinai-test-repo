const express = require("express");
const router = express.Router();
const products = require("../data/products.json");

router.get("/", (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];

  const productsByCategory = {};
  for (const product of products) {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = 0;
    }
    productsByCategory[product.category]++;
  }

  res.json({
    totalProducts: products.length,
    totalCategories: categories.length,
    productsByCategory,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

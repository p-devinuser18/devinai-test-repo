const express = require("express");
const router = express.Router();
const products = require("../data/products.json");

router.get("/", (req, res) => {
  const totalProducts = products.length;
  const categories = [...new Set(products.map((p) => p.category))];
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;
  const averagePrice =
    totalProducts > 0
      ? Math.round(
          (products.reduce((sum, p) => sum + p.price, 0) / totalProducts) * 100,
        ) / 100
      : 0;

  res.json({
    totalProducts,
    categories,
    inStockCount,
    outOfStockCount,
    averagePrice,
  });
});

module.exports = router;

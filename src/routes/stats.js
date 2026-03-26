const express = require("express");
const router = express.Router();
const products = require("../data/products.json");

router.get("/", (req, res) => {
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  const categories = [...new Set(products.map((p) => p.category))];

  const averagePrice =
    totalProducts > 0
      ? Math.round(
          (products.reduce((sum, p) => sum + p.price, 0) / totalProducts) * 100
        ) / 100
      : 0;

  const categoryBreakdown = categories.map((category) => {
    const items = products.filter((p) => p.category === category);
    return {
      category,
      count: items.length,
      averagePrice:
        Math.round(
          (items.reduce((sum, p) => sum + p.price, 0) / items.length) * 100
        ) / 100,
    };
  });

  res.json({
    totalProducts,
    inStockCount,
    outOfStockCount,
    categories,
    averagePrice,
    categoryBreakdown,
  });
});

module.exports = router;

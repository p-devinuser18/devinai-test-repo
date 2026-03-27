const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const products = require("../data/products.json");

router.get("/", (req, res) => {
  const totalProducts = products.length;

  const categoryCounts = {};
  for (const product of products) {
    const cat = product.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  let orders = [];
  try {
    const ordersPath = path.join(__dirname, "../data/orders.json");
    const data = fs.readFileSync(ordersPath, "utf-8");
    orders = JSON.parse(data);
  } catch {
    orders = [];
  }

  const totalOrders = orders.length;

  const orderStatusCounts = {};
  for (const order of orders) {
    const status = order.status;
    orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
  }

  res.json({
    totalProducts,
    totalOrders,
    categoryCounts,
    orderStatusCounts,
  });
});

module.exports = router;

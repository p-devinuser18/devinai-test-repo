const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const products = require("../data/products.json");

function loadOrders() {
  const ordersPath = path.join(__dirname, "../data/orders.json");
  try {
    if (fs.existsSync(ordersPath)) {
      return JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
    }
  } catch (e) {
    // orders.json missing or invalid — fall back to empty
  }
  return [];
}

router.get("/", (req, res) => {
  const orders = loadOrders();

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const categoryCounts = {};
  for (const product of products) {
    const cat = product.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const orderStatusCounts = {};
  for (const order of orders) {
    const status = order.status;
    orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
  }

  res.json({ totalProducts, totalOrders, categoryCounts, orderStatusCounts });
});

module.exports = router;

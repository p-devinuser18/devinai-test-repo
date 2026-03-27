const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const products = require("../data/products.json");

function loadOrders() {
  try {
    const ordersPath = path.join(__dirname, "../data/orders.json");
    const data = fs.readFileSync(ordersPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
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

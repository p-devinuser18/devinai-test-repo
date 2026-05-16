const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/orders.json");

async function readOrders() {
  const data = await fs.promises.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeOrders(orders) {
  await fs.promises.writeFile(
    DATA_PATH,
    JSON.stringify(orders, null, 2) + "\n",
  );
}

// GET / — list all orders, optional ?status= filter
router.get("/", async (req, res) => {
  const orders = await readOrders();
  const status = req.query.status;
  const filtered = status
    ? orders.filter((o) => o.status.toLowerCase() === status.toLowerCase())
    : orders;
  res.json(filtered);
});

// GET /:id — get a single order by id
router.get("/:id", async (req, res) => {
  const orders = await readOrders();
  const order = orders.find((o) => o.id === parseInt(req.params.id, 10));
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// POST / — create a new order
router.post("/", async (req, res) => {
  const { productId, quantity, customerName } = req.body;
  if (!productId || !quantity || !customerName) {
    return res
      .status(400)
      .json({ error: "productId, quantity, and customerName are required" });
  }

  const productsData = await fs.promises.readFile(
    path.join(__dirname, "../data/products.json"),
    "utf-8",
  );
  const products = JSON.parse(productsData);
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: "Invalid productId" });
  }

  const orders = await readOrders();
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
    productId,
    quantity,
    customerName,
    status: "pending",
    total: parseFloat((product.price * quantity).toFixed(2)),
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  await writeOrders(orders);
  res.status(201).json(newOrder);
});

// PUT /:id/status — update order status
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status.toLowerCase())) {
    return res
      .status(400)
      .json({ error: `status must be one of: ${validStatuses.join(", ")}` });
  }

  const orders = await readOrders();
  const order = orders.find((o) => o.id === parseInt(req.params.id, 10));
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = status.toLowerCase();
  await writeOrders(orders);
  res.json(order);
});

// DELETE /:id — delete an order
router.delete("/:id", async (req, res) => {
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  const deleted = orders.splice(index, 1)[0];
  await writeOrders(orders);
  res.json(deleted);
});

module.exports = router;

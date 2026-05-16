const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  const data = await fs.promises.readFile(
    path.join(__dirname, "../data/orders.json"),
    "utf-8"
  );
  const orders = JSON.parse(data);

  const status = req.query.status;
  const filtered = status
    ? orders.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      )
    : orders;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  res.json(paginated);
});

router.get("/:id", async (req, res) => {
  const data = await fs.promises.readFile(
    path.join(__dirname, "../data/orders.json"),
    "utf-8"
  );
  const orders = JSON.parse(data);
  const order = orders.find((o) => o.id === parseInt(req.params.id, 10));

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

module.exports = router;

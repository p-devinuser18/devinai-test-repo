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
  res.json(orders);
});

module.exports = router;

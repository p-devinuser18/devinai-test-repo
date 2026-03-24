const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ products: [] });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id, name: "Sample Product" });
});

module.exports = router;

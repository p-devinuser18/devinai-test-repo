const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ users: [] });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id, name: "Sample User" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/:userId", async (req, res) => {
  const data = await fs.promises.readFile(
    path.join(__dirname, "../data/users.json"),
    "utf-8"
  );
  const users = JSON.parse(data);
  const user = users.find((u) => u.id === req.params.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

module.exports = router;

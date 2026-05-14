const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/:userId", async (req, res) => {
  const data = await fs.promises.readFile(
    path.join(__dirname, "../data/users.json"),
    "utf-8",
  );
  const users = JSON.parse(data);
  const userId = parseInt(req.params.userId, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    joinDate: user.joinDate,
  });
});

module.exports = router;

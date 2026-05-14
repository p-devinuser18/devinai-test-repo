const express = require('express');
const path = require('path');
const router = express.Router();
const users = require(path.join(__dirname, '../data/users.json'));

router.get('/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinDate: user.joinDate,
  });
});

module.exports = router;

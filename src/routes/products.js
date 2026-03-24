const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

router.get('/', (req, res) => {
  const { category } = req.query;

  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.json(filtered);
  }

  res.json(products);
});

module.exports = router;

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8')
  );
  const categories = [...new Set(products.map((p) => p.category))].sort();
  res.json(categories);
});

module.exports = router;

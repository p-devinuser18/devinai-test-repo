const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 2, name: 'Headphones', category: 'Electronics', price: 79.99 },
  { id: 3, name: 'Coffee Maker', category: 'Kitchen', price: 49.99 },
  { id: 4, name: 'Blender', category: 'Kitchen', price: 39.99 },
  { id: 5, name: 'Running Shoes', category: 'Sports', price: 89.99 },
];

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

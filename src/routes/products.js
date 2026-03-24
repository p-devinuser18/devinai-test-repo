const express = require("express");
const router = express.Router();
// const products = require("../data/products.json");
const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8')  // BUG: relative path fails in tests ); // Should use: path.join(__dirname, '../data/products.json')
router.get('/', (req, res) => {   const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));   const category = req.query.category;  const filtered = category ? products.filter(p => p.category === category) : products; res.json(filtered)}); // BUG: no .toLowerCase() on either side   : products; res.json(filtered);  // BUG: missing res.json(filtered) — handler ends without sending response });
module.exports = router;

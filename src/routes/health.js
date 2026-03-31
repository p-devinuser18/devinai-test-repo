const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { version } = require('../../package.json');

const startTime = Date.now();

router.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'ok',
    uptime,
    version,
  });
});

router.get('/ready', (req, res) => {
  const checks = {};

  // Check products.json
  try {
    fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
    checks.products = 'ok';
  } catch (err) {
    checks.products = 'fail';
  }

  // Check orders.json (skip gracefully if it doesn't exist)
  try {
    fs.readFileSync(path.join(__dirname, '../data/orders.json'), 'utf8');
    checks.orders = 'ok';
  } catch (err) {
    if (err.code === 'ENOENT') {
      checks.orders = 'ok';
    } else {
      checks.orders = 'fail';
    }
  }

  const allOk = Object.values(checks).every((v) => v === 'ok');
  const status = allOk ? 'ready' : 'not ready';
  const statusCode = allOk ? 200 : 503;

  res.status(statusCode).json({ status, checks });
});

module.exports = router;

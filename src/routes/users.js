const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  res.json({ users: [] });
  logger.info('Request handled', { method: req.method, path: req.originalUrl, statusCode: res.statusCode });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: 'Sample User' });
  logger.info('Request handled', { method: req.method, path: req.originalUrl, statusCode: res.statusCode });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { version } = require('../../package.json');
const logger = require('../utils/logger');

const startTime = Date.now();

router.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'ok',
    uptime,
    version,
  });
  logger.info('Request handled', { method: req.method, path: req.originalUrl, statusCode: res.statusCode });
});

module.exports = router;

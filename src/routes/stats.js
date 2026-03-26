const express = require('express');
const router = express.Router();
const { version } = require('../../package.json');

const startTime = Date.now();
let totalRequests = 0;
const endpointCounts = {};

function trackRequest(req, res, next) {
  totalRequests++;
  const key = `${req.method} ${req.baseUrl}${req.path}`;
  endpointCounts[key] = (endpointCounts[key] || 0) + 1;
  next();
}

router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    totalRequests,
    endpointCounts,
    uptimeSeconds,
    version,
  });
});

module.exports = { router, trackRequest };

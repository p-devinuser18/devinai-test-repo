const metrics = {
  totalRequests: 0,
  successCount: 0,
  failureCount: 0,
  byStatusCode: {},
};

const metricsMiddleware = (req, res, next) => {
  res.on("finish", () => {
    metrics.totalRequests++;
    if (res.statusCode >= 200 && res.statusCode < 400) {
      metrics.successCount++;
    } else {
      metrics.failureCount++;
    }
    metrics.byStatusCode[res.statusCode] =
      (metrics.byStatusCode[res.statusCode] || 0) + 1;
  });
  next();
};

const getMetrics = () => ({ ...metrics, byStatusCode: { ...metrics.byStatusCode } });

const resetMetrics = () => {
  metrics.totalRequests = 0;
  metrics.successCount = 0;
  metrics.failureCount = 0;
  metrics.byStatusCode = {};
};

module.exports = { metricsMiddleware, getMetrics, resetMetrics };

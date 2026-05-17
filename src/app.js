const express = require("express");
const auth = require("./middleware/auth");
const { metricsMiddleware } = require("./middleware/metrics");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const healthRouter = require("./routes/health");
const metricsRouter = require("./routes/metrics");

const app = express();

app.use(express.json());
app.use(metricsMiddleware);

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Metrics endpoint — no auth middleware
app.use("/metrics", metricsRouter);

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/api/products", auth, productsRouter);

module.exports = app;

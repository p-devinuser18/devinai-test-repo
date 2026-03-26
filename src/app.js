const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const weatherRouter = require("./routes/weather");
const healthRouter = require("./routes/health");
const { router: statsRouter, trackRequest } = require("./routes/stats");

const app = express();

app.use(express.json());

// Track all incoming requests for stats
app.use(trackRequest);

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Stats endpoint — no auth middleware
app.use("/stats", statsRouter);

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/api/products", auth, productsRouter);
app.use("/api/weather", weatherRouter);

module.exports = app;

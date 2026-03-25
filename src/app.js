const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const healthRouter = require("./routes/health");
const ordersRouter = require('./routes/orders');

const app = express();

app.use(express.json());

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/api/products", auth, productsRouter);

// Orders endpoint
app.use('/api/orders', ordersRouter);

module.exports = app;

const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const healthRouter = require("./routes/health");

let productsRouter;
try {
  productsRouter = require("./routes/products");
} catch (e) {
  console.error("Failed to load products router:", e.message);
}

const app = express();

app.use(express.json());

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Protected routes
app.use("/users", auth, usersRouter);
if (productsRouter) {
  app.use("/api/products", auth, productsRouter);
}

module.exports = app;

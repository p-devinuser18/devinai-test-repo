const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const healthRouter = require("./routes/health");

const app = express();

app.use(express.json());

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Protected routes
app.use("/users", auth, usersRouter);

module.exports = app;

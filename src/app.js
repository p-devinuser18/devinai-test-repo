const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const healthRouter = require("./routes/health");
const profileRouter = require("./routes/profile");

const app = express();

app.use(express.json());

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/api/profile", profileRouter);

module.exports = app;

const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const userRouter = require("./routes/user");
const productsRouter = require("./routes/products");
const weatherRouter = require("./routes/weather");
const healthRouter = require("./routes/health");

const app = express();

app.use(express.json());

// Health endpoint — no auth middleware
app.use("/health", healthRouter);

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/user", auth, userRouter);
app.use("/api/products", auth, productsRouter);
app.use("/api/weather", weatherRouter);

module.exports = app;

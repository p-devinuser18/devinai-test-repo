const express = require("express");
const auth = require("./middleware/auth");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");

const app = express();

app.use(express.json());

// Protected routes
app.use("/users", auth, usersRouter);
app.use("/api/products", auth, productsRouter);

module.exports = app;

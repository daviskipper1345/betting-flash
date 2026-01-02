require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
// Middlewares
app.use(cors());
app.use(express.json());

const { authRoutes } = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Betting Flash backend is running"
  });
});

module.exports = app;
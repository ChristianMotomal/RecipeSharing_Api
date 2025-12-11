require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// API routes
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

// Serve static files (Swagger HTML + YAML)
app.use(express.static(path.join(__dirname, "public")));

// /api-docs route serves the static Swagger page
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Root greeting
app.get("/", (req, res) => {
  res.send("🍽️ Recipe Sharing API is running!");
});

// MongoDB connection and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.log(err));

module.exports = app;
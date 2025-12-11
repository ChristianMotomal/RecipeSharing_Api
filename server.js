require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ROUTES
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("🍽️ Recipe Sharing API is running!");
});

// CONNECT TO MONGO (but DO NOT listen on port)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

module.exports = app;   // IMPORTANT for Vercel serverless

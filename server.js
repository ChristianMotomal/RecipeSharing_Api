require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

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

// SWAGGER
const swaggerDoc = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ROOT
app.get("/", (req, res) => {
  res.send("🍽️ Recipe Sharing API is running!");
});

// CONNECT TO MONGO (serverless-friendly)
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase(uri) {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// export the app for Vercel
module.exports = async (req, res) => {
  await connectToDatabase(process.env.MONGODB_URI);
  return app(req, res);
};
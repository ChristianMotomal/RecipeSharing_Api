require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
//hi
// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ROUTES
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

// SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ROOT
app.get("/", (req, res) => {
  res.send("🍽️ Recipe Sharing API is running!");
});

// CONNECT TO MONGODBhtdh
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
  })
  .catch(err => console.log(err));
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// ... other requires
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

// SWAGGER
const swaggerDocument = YAML.load(path.join(__dirname, "public/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CONNECT TO MONGO (serverless-friendly)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

module.exports = app;

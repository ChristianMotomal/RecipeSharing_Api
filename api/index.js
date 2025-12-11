import serverless from "serverless-http";
import app from "../server.js";   // import your express app

export default serverless(app);

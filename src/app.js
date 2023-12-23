const express = require("express");
const routes = require("./routes");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const responseTime = require("response-time");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(responseTime);

app.use("/api/auth", routes.authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is healthy",
    uptime: Math.floor(process.uptime()) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import responseTime from "response-time";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname } from "path";

import routes from "./routes/index.route.js";
import httpMethodHandler from "./middleware/httpMethodHandler.js";
import pool from "../db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(responseTime());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "prod") {
  app.use(morgan("combined"));
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(httpMethodHandler);

app.use("/api/v1/auth", routes.authRoutes);
app.use("/api/v1/expenses", routes.expenseRoutes);
app.use("/api/v1/health", routes.healthRoute);
app.use("/api/v1/currencies", routes.currenciesRoute);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "SplitCrew API",
      version: "1.0.0",
      description:
        "API for an expense splitting app designed to simplify and streamline the process of splitting expenses among friends, family, or colleagues.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Deolu",
        url: "https://sudodeo.vercel.app",
        email: "sudodeo@gmail.com",
      },
    },
  },
  apis: [`${__dirname}/routes/*.route.js`],
};

const spec = swaggerJsdoc(options);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(spec, { explorer: true })
);

app.get("/", (_, res) => {
  res.redirect("/api/docs");
});

// Error handler for routes that fall through
app.use((_, res) => {
  res.status(404).json({
    success: false,
    error: "The requested resource was not found on this server",
  });
});

export default app;

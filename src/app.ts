import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import responseTime from "response-time";

import routes from "./routes/index.route";
import httpMethodHandler from "./middleware/httpMethodHandler";

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
}

app.use(httpMethodHandler);

app.use("/api/v1/auth", routes.authRoutes);
app.use("/api/v1/expenses", routes.expenseRoutes);
app.use("/api/v1/health", routes.healthRoute);
app.use("/api/v1/currencies", routes.currenciesRoute);

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

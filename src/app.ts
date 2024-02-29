import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import responseTime from "response-time";

import indexRoute from "./routes/index.route";
import "./process";
import {
  errorHandler,
  methodNotAllowed,
  routeNotFound,
} from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(responseTime());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "prod") {
  app.use(morgan("combined"));
  app.set("trust proxy", 1); // trust first proxy
}

app.use(methodNotAllowed);
app.use("/api/v1", indexRoute);
app.use(routeNotFound);
app.use(errorHandler);

export default app;

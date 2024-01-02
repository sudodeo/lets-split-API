const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  morgan = require("morgan"),
  compression = require("compression"),
  responseTime = require("response-time"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express"),
  routes = require("./routes/index.route");

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
}

app.use("/api/auth", routes.authRoutes);
app.use("/api/expenses", routes.expenseRoutes);
app.use("/api/health", routes.healthRoute);
app.use("/api/currencies", routes.currenciesRoute);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Lets Split API",
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

app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

module.exports = app;

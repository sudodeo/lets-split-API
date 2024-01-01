const currencyRoute = require("express").Router();
const currencyController = require("../controllers/currencies.controller");

currencyRoute.get("/", currencyController.getCurrencies);

module.exports = currencyRoute;

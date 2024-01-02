import {Router} from "express";
import currencyController from "../controllers/currencies.controller.js";

const currencyRoute = Router();

currencyRoute.get("/", currencyController.getCurrencies);

export default currencyRoute;

import {Router} from "express";
import currencyController from "../controllers/currencies.controller";

const currencyRoute = Router();

currencyRoute.get("/", currencyController.getCurrencies);

export default currencyRoute;

import logger from "../config/loggerConfig";
import { HttpCode } from "../middleware/error.middleware";
import currenciesModel from "../models/currencies.model";
import { NextFunction, Request, Response } from "express";

const getCurrencies = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currencies = await currenciesModel.getCurrencies();
    res.status(HttpCode.OK).json({ success: true, currencies });
  } catch (error) {
    logger.error(`currenciesController error: ${error}`);

    next(error);
  }
};

export default { getCurrencies };

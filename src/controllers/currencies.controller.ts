import logger from "../config/loggerConfig";
import currenciesModel from "../models/currencies.model";
import { Request, Response } from "express";

const getCurrencies = async (_req: Request, res:Response) => {
  try {
    const currencies = await currenciesModel.getCurrencies();
    res.status(200).json({ success: true, currencies });
  } catch (error) {
    logger.error(`currenciesController error: ${error}`);
    
    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

export default { getCurrencies };

import logger from "../config/loggerConfig";
import expenseModel from "../models/expense.model";
import currencyModel from "../models/currencies.model";
import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthorized } from "../middleware/error.middleware";

const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { created } = req.query;

  const userID = req.authUser?.id;

  if (userID == null) {
    throw new Unauthorized("you do not have permission to perform this action");
  }

  let expenses = [];
  try {
    if (created === "true") {
      expenses = await expenseModel.getCreatedExpenses(userID);
    } else {
      expenses = await expenseModel.getAllExpenses(userID);
    }

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    logger.error(`getAllExpenses error: ${error}`);

    next(error);
  }
};

const getExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { expenseID } = req.params;
    const expense = await expenseModel.getExpense(expenseID);
    if (!expense) {
      res.status(404).json({ success: false, error: "expense not found" });
      return;
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    logger.error(`getExpense error: ${error}`);

    next(error);
  }
};

const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the currency is supported
    const currency = await currencyModel.getCurrency(req.body.currency_code);
    if (!currency || !currency.is_active) {
      throw new BadRequest("Currency not supported");
    }

    req.body.currency_code_id = currency.id;

    const expense = await expenseModel.createExpense(req.body);
    if (!expense) {
      throw new Error("expense not created");
    }

    res.status(201).json({ success: true, expense });
  } catch (error) {
    logger.error(`createExpense error: ${error}`);
    next(error);
  }
};

const getExpenseSummary = async (_req: Request, _res: Response) => {};
const settleExpense = async (_req: Request, _res: Response) => {};

export default {
  getAllExpenses,
  getExpense,
  getExpenseSummary,
  createExpense,
  settleExpense,
};

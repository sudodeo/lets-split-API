import logger from "../config/loggerConfig";
import expenseModel from "../models/expense.model";
import currencyModel from "../models/currencies.model";
import { Request, Response } from "express";

const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
  const { created } = req.query;

  const authUser = req.user;

  if (authUser == null) {
    res.status(401).json({ success: false, error: "unauthorised" });
    return;
  }

  const user_id = authUser.id;
  let expenses = [];
  try {
    if (created && created === "true") {
      expenses = await expenseModel.getCreatedExpenses(user_id);
    } else {
      expenses = await expenseModel.getAllExpenses(user_id);
    }

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    logger.error(`getAllExpenses error: ${error}`);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const getExpense = async (req: Request, res: Response): Promise<void> => {
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

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const createExpense = async (req: Request, res: Response) => {
  try {
    // Check if the currency is supported
    const currency = await currencyModel.getCurrency(req.body.currency_code);
    if (!currency || !currency.is_active) {
      return res
        .status(400)
        .json({ success: false, error: "Currency not supported" });
    }

    req.body.currency_code_id = currency.id;

    const expense = await expenseModel.createExpense(req.body);
    console.log(expense);
    if (!expense) {
      throw new Error("expense not created");
    }

    return res.status(201).json({ success: true, expense });
  } catch (error) {
    logger.error(`createExpense error: ${error}`);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
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

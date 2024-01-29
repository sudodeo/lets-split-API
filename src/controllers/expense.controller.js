import logger from "../config/loggerConfig.js";
import expenseModel from "../models/expense.model.js";
import currencyModel from "../models/currencies.model.js";

const getAllExpenses = async (req, res) => {
  const { created } = req.query;
  const user_id = req.user.id;
  let expenses = "";
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

const getExpense = async (req, res) => {
  try {
    const { expenseID } = req.params;
    const expense = await expenseModel.getExpense(expenseID);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "expense not found" });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    logger.error(`getExpense error: ${error}`);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const createExpense = async (req, res) => {
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

const getExpenseSummary = async (req, res) => {};
const settleExpense = async (req, res) => {};

export default {
  getAllExpenses,
  getExpense,
  getExpenseSummary,
  createExpense,
  settleExpense,
};

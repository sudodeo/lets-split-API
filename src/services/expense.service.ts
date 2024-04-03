import QueryString from "qs";
import currencyModel from "../models/currencies.model";
import { BadRequest } from "../middleware/error.middleware";
import expenseModel from "../models/expense.model";
import { Expense } from "../types/expense.types";

export class ExpenseService {
  listExpenses = async (queryParams: QueryString.ParsedQs, userID: string) => {
    const { created } = queryParams;
    let expenses = [];
    if (created === "true") {
      expenses = await expenseModel.getCreatedExpenses(userID);
    } else {
      expenses = await expenseModel.listExpenses(userID);
    }

    return expenses;
  };

  getExpense = async (expenseID: string) => {
    return await expenseModel.getExpense(expenseID);
  };

  createExpense = async (expenseData: Expense) => {
    // Check if the currency is supported
    const currency = await currencyModel.getCurrency(expenseData.currency_code);
    if (!currency || !currency.is_active) {
      throw new BadRequest("Currency not supported");
    }

    expenseData.currency_code_id = currency.id;

    return await expenseModel.createExpense(expenseData);
  };
}

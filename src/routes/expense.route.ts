import { Router } from "express";

import { ExpenseController } from "../controllers/expense.controller";

const expenseRouter = Router();
const expenseController = new ExpenseController();

expenseRouter.get("/", expenseController.listExpenses);

expenseRouter.post("/", expenseController.createExpense);

expenseRouter.get("/expense-summary", expenseController.getExpenseSummary);

expenseRouter.post("/settle-expense", expenseController.settleExpense);

expenseRouter.get("/:id", expenseController.getExpense);

export default expenseRouter;

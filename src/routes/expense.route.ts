import { Router } from "express";

import expenseController from "../controllers/expense.controller";

const expenseRouter = Router();

expenseRouter.get("/", expenseController.getAllExpenses);

expenseRouter.post("/", expenseController.createExpense);

expenseRouter.get("/expense-summary", expenseController.getExpenseSummary);

expenseRouter.post("/settle-expense", expenseController.settleExpense);

expenseRouter.get("/:expenseID", expenseController.getExpense);

export default expenseRouter;

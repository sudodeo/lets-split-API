import { Router } from "express";

import { ExpenseController } from "../controllers/expense.controller";

const expenseRouter = Router();
const expenseController = new ExpenseController();

expenseRouter.get("/", expenseController.listExpenses);

expenseRouter.post("/", expenseController.createExpense);

expenseRouter.get("/:expenseId", expenseController.getExpense);

expenseRouter.get("/:expenseId/summary", expenseController.getExpenseSummary);

expenseRouter.post("/:expenseId/settle", expenseController.settleExpense);

export default expenseRouter;

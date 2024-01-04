import { Router } from "express";

import expenseController from "../controllers/expense.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const expenseRouter = Router();

expenseRouter.get("/", authMiddleware.isAuth, expenseController.getAllExpenses);

expenseRouter.get(
  "/:expenseID",
  authMiddleware.isAuth,
  expenseController.getExpense
);

expenseRouter.get(
  "/expense-summary",
  authMiddleware.isAuth,
  expenseController.getExpenseSummary
);

expenseRouter.post("/", authMiddleware.isAuth, expenseController.createExpense);

expenseRouter.post(
  "/settle-expense",
  authMiddleware.isAuth,
  expenseController.settleExpense
);

export default expenseRouter;

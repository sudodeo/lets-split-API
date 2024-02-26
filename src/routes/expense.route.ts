import { Router } from "express";

import expenseController from "../controllers/expense.controller";
import authMiddleware from "../middleware/auth.middleware";

const expenseRouter = Router();

expenseRouter.get(
  "/",
  authMiddleware.authenticateToken,
  expenseController.getAllExpenses,
);

expenseRouter.get(
  "/:expenseID",
  authMiddleware.authenticateToken,
  expenseController.getExpense,
);

expenseRouter.get(
  "/expense-summary",
  authMiddleware.authenticateToken,
  expenseController.getExpenseSummary,
);

expenseRouter.post(
  "/",
  authMiddleware.authenticateToken,
  expenseController.createExpense,
);

expenseRouter.post(
  "/settle-expense",
  authMiddleware.authenticateToken,
  expenseController.settleExpense,
);

export default expenseRouter;

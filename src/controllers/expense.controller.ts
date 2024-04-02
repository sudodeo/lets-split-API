import logger from "../config/loggerConfig";
import { NextFunction, Response } from "express";
import {
  HttpCode,
  ResourceNotFound,
  Unauthorized,
} from "../middleware/error.middleware";
import { ExpenseService } from "../services/expense.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class ExpenseController {
  private expenseService = new ExpenseService();

  listExpenses = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userID = req.authUser?.id;

      if (userID == null) {
        throw new Unauthorized(
          "you do not have permission to perform this action",
        );
      }

      const expenses = await this.expenseService.listExpenses(
        req.query,
        userID,
      );

      res.status(HttpCode.OK).json({ success: true, expenses });
    } catch (error) {
      logger.error(`listExpenses error: ${error}`);

      next(error);
    }
  };

  getExpense = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const expense = await this.expenseService.getExpense(id);
      if (!expense) {
        throw new ResourceNotFound("expense not found");
      }

      res.status(HttpCode.OK).json({ success: true, expense });
    } catch (error) {
      logger.error(`getExpense error: ${error}`);
      next(error);
    }
  };

  createExpense = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const expense = await this.expenseService.createExpense(req.body);
      if (!expense) {
        throw new Error("expense not created");
      }

      res.status(HttpCode.CREATED).json({ success: true, expense });
    } catch (error) {
      logger.error(`createExpense error: ${error}`);
      next(error);
    }
  };

  // getExpenseSummary = async (_req: Request, _res: Response) => {};
  // settleExpense = async (_req: Request, _res: Response) => {};
}

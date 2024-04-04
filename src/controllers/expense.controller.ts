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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userID = req.authUser?.id;

      if (userID == null) {
        throw new Unauthorized(
          "you do not have permission to perform this action"
        );
      }

      const expenses = await this.expenseService.listExpenses(
        req.query,
        userID
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const { expenseId } = req.params;
      const expense = await this.expenseService.getExpense(expenseId);
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
    next: NextFunction
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

  getExpenseSummary = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const expenseId = req.params.expenseId;
      const summary = await this.expenseService.getExpenseSummary(expenseId);
      res.status(HttpCode.OK).json({ success: true, summary });
    } catch (error) {
      logger.error(`getExpenseSummary error: ${error}`);
      next(error);
    }
  };

  settleExpense = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const expenseId = req.params.expenseId;
      const expense = await this.expenseService.settleExpense(expenseId);
      res.status(HttpCode.OK).json({ success: true, expense });
    } catch (error) {
      logger.error(`settleExpense error: ${error}`);
      next(error);
    }
  };
}

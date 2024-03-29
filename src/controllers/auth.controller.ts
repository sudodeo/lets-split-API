import logger from "../config/loggerConfig";
import redisClient from "../db/redis";
import {
  HttpCode,
  InvalidInput,
  Unauthorized,
} from "../middleware/error.middleware";
import { AuthService } from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { validateRegistration } from "../utils/validator";

export class AuthController {
  private authService = new AuthService();
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = await validateRegistration(req.body);
      if (errors.length > 0) {
        throw new InvalidInput("Invalid input", errors);
      }

      const user = await this.authService.registerUser(req.body);

      res.status(HttpCode.OK).json({ success: true, user });
    } catch (error) {
      logger.error(`createUser error: ${error}`);
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.params;
      const { email } = req.body;

      await this.authService.verifyEmail(email, token);

      res
        .status(HttpCode.OK)
        .json({ success: true, message: "email verified" });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.loginUser(email, password);

      res.cookie("jwt", token);
      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(HttpCode.OK).json({ success: true, user, token });
    } catch (error) {
      logger.error(`login error: ${error}`);
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      await this.authService.forgotPassword(email);

      res
        .status(HttpCode.OK)
        .json({ success: true, message: "Password reset email sent" });
    } catch (error) {
      logger.error(`forgotPassword error: ${error}`);
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.params;
      const { password, email } = req.body;

      await this.authService.resetPassword(email, token, password);

      res
        .status(HttpCode.OK)
        .json({ success: true, message: "Password reset successful" });
    } catch (error) {
      logger.error(`resetPassword error: ${error}`);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.authUser) {
        throw new Unauthorized(
          "you do not have permissions to access this route"
        );
      }
      const token = req.cookies.jwt;
      await redisClient.set(token, "logged out", {
        PXAT: req.authUser.exp,
      });

      res.status(HttpCode.OK).end();
    } catch (error) {
      logger.error(`logout error: ${error}`);
      next(error);
    }
  }
}

import logger from "../config/loggerConfig";
import {
  HttpCode,
  ResourceNotFound,
  ServerError,
  Unauthorized,
} from "../middleware/error.middleware";
import { UserService } from "../services/user.service";
import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../types/user.types";

export class UserController {
  private userService = new UserService();

  listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.listUsers();
      res.status(HttpCode.OK).json({ success: true, users });
    } catch (error) {
      logger.error(`getAllUsers error: ${error}`);
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = req.authUser;
      if (authUser == null) {
        throw new Unauthorized(
          "you do not have permission to perform this action"
        );
      }

      const userID = authUser.role == "admin" ? req.params.id : authUser.id;

      const user = await this.userService.getUserByID(userID);
      if (user == null) {
        throw new ResourceNotFound("user not found");
      }

      res.status(HttpCode.OK).json({ success: true, user });
    } catch (error) {
      logger.error(`getUser error: ${error}`);
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authUser: AuthUser | undefined = req.authUser;
      if (authUser == null) {
        throw new Unauthorized(
          "you do not have permission to perform this action"
        );
      }

      const userID = authUser.role == "admin" ? req.params.id : authUser.id;

      const user = await this.userService.updateUser(userID, req.body);
      if (user == null) {
        throw new ResourceNotFound("user not found");
      }

      res.status(HttpCode.OK).json({ success: true, user });
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const deletedUser = await this.userService.deleteUser(id);
      if (deletedUser == null) {
        throw new ServerError("an error occured");
      }

      res.status(HttpCode.OK).json({ success: true, deletedUser });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}

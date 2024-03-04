import logger from "../config/loggerConfig";
import authService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { ServerError, Unauthorized } from "./error.middleware";

const authorizeUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Unauthorized("access denied");
    }
    const decodedJwt = authService.verifyJwt(token);
    if (decodedJwt == null) {
      throw new ServerError("decoded jwt null");
    }
    const decodedPayload = decodedJwt.payload;
    if (decodedPayload.iss !== "authService") {
    }
    if (decodedPayload.aud !== "SplitCrew") {
      throw new Unauthorized("invalid audience");
    }

    req.authUser = { id: decodedPayload.sub, role: decodedPayload.role };
    next();
  } catch (error) {
    logger.error(`authorizeUser error: ${error}`);
    next(error);
  }
  // next();
};

export default { authorizeUser };

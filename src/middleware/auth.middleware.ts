import logger from "../config/loggerConfig";
import { NextFunction, Request, Response } from "express";
import { ServerError, Unauthorized } from "./error.middleware";
import { verifyJwt } from "../utils/token";
import redisClient from "../db/redis";

const authorizeUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new Unauthorized("access denied");
    }
    token = token.replace("Bearer ", "");

    // check if token is blacklisted in redis (logged out user)
    const blacklistedToken = await redisClient.get(token);
    if (blacklistedToken) {
      console.log(blacklistedToken);
      throw new Unauthorized("access denied, invalid token");
    }

    const decodedJwt = verifyJwt(token);
    if (decodedJwt == null) {
      throw new ServerError("decoded jwt null");
    }

    const decodedPayload = decodedJwt.payload;
    if (decodedPayload.iss !== (process.env.JWT_ISS as string)) {
      throw new Unauthorized("invalid issuer");
    }
    if (decodedPayload.aud !== (process.env.JWT_AUD as string)) {
      throw new Unauthorized("invalid audience");
    }

    const exp = decodedPayload.exp;
    if (exp < new Date().getTime()) {
      throw new Unauthorized("token expired");
    }

    req.authUser = { id: decodedPayload.sub, role: decodedPayload.role, exp };
    next();
  } catch (error) {
    logger.error(`authorizeUser error: ${error}`);
    next(error);
  }
};

export default { authorizeUser };

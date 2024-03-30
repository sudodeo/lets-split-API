import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "../config";
import logger from "../config/loggerConfig";

export const generateJwt = (id: string, role: string) => {
  const maxAge = 5 * 60 * 60 * 1000; // 5 hours
  return jwt.sign(
    {
      sub: id,
      iat: new Date().getTime(),
      iss: process.env.JWT_ISS as string,
      aud: process.env.JWT_AUD as string,
      role,
    },
    JWT_SECRET as string,
    { expiresIn: maxAge },
  );
};

export const verifyJwt = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET as string, {
      complete: true,
    });
  } catch (error) {
    logger.error(`verifyJwt error: ${error}`);
    throw error;
  }
};

export const generateToken = async () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

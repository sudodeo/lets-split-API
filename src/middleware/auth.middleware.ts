import logger from "../config/loggerConfig";
// import authService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ success: false, error: "Access denied" });
      return;
    }
    // const decoded = authService.verifyJwt(token);
    // if (decoded.iss !== "authService") {
    // }
    // if (decoded.aud !== "SplitCrew") {
    //   return res
    //      .status(401)
    //     .json({ success: false, error: "Invalid audience." });
    // }

    // req.user = decoded;
    next();
  } catch (error) {
    logger.error(`authenticateToken error: ${error}`);

    res.status(401).json({
      success: false,
      error: "Authentication Failed",
    });
  }
  next();
};

// const isAuth = async (req, res, next) => {
//   if (!req.session.isAuth) {
//     return res.status(401).json({ success: false, error: "unauthorised" });
//   }
//   next();
// };

export default { authenticateToken };

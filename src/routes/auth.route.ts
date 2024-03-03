import { Router } from "express";

import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/verify/:token", authController.verifyEmail);

authRouter.post(
  "/logout",
  authMiddleware.authenticateToken,
  authController.logout,
);

authRouter.post(
  "/refresh",
  authMiddleware.authenticateToken,
  authController.refreshToken,
);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.post("/reset-password/:token", authController.resetPassword);

export default authRouter;

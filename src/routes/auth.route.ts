import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();
const authController = new AuthController()

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.post("/verify/:token", authController.verifyEmail);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.post("/reset-password/:token", authController.resetPassword);

authRouter.use(authMiddleware.authorizeUser);

authRouter.post("/logout", authController.logout);

export default authRouter;

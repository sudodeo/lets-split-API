import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", AuthController.register);

authRouter.post("/login", AuthController.login);

authRouter.post("/verify/:token", AuthController.verifyEmail);

authRouter.post("/forgot-password", AuthController.forgotPassword);

authRouter.post("/reset-password/:token", AuthController.resetPassword);

authRouter.use(authMiddleware.authorizeUser);

authRouter.post("/logout", AuthController.logout);

// authRouter.post("/refresh", authController.refreshToken);

export default authRouter;

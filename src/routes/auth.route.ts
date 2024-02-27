import { Router } from "express";
import { check } from "express-validator";

import authController from "../controllers/auth.controller";
import validateMiddleware from "../middleware/validate.middleware";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  check("email")
    .exists()
    .notEmpty()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("invalid email address"),
  check("firstName").exists().notEmpty().trim().exists(),
  check("lastName").exists().notEmpty().trim().exists(),
  check("dob")
    .exists()
    .notEmpty()
    .trim()
    .exists()
    .isDate()
    .withMessage("invalid date. use YYYY-MM-DD format"),
  check("password")
    .trim()
    .exists()
    .isStrongPassword()
    .withMessage("password not strong enough"),
  validateMiddleware.validateInput,
  authController.register,
);

authRouter.post(
  "/login",
  check("email").exists().notEmpty().isEmail().normalizeEmail(),
  check("password").exists().notEmpty(),
  validateMiddleware.validateInput,
  authController.login,
);

authRouter.post(
  "/verify/:token",
  check("email").exists().notEmpty().isEmail().normalizeEmail(),
  validateMiddleware.validateInput,
  authController.verifyEmail,
);

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

authRouter.post(
  "/forgot-password",
  check("email").exists().notEmpty().isEmail().normalizeEmail(),
  authController.forgotPassword,
);

authRouter.post(
  "/reset-password/:token",
  check("email").exists().notEmpty().isEmail().normalizeEmail(),
  check("password")
    .exists()
    .trim()
    .isStrongPassword()
    .withMessage("password not strong enough"),
  check("confirmPassword")
    .exists()
    .custom((value, { req }) => value === req.body.password),
  authController.resetPassword,
);

export default authRouter;

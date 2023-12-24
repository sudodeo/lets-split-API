const authRouter = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

authRouter.post("/register", userController.createUser);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password/:token", authController.resetPassword);

module.exports = authRouter;

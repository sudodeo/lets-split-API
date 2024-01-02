const authRouter = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const validateMiddleware = require("../middleware/validate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const { check, body } = require("express-validator");

/**
 * @swagger
 *
 * /api/auth/register:
 *  post:
 *    summary: Register as a new user
 *    tags:
 *      - authentication
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: successful
 *        content:
 *          application/json:
 *            example:
 *              {
 *               "success": true,
 *               "data": {
 *               "id": "902e1b42-3e3d-4aed-9c90-0632b70296c6",
 *               "first_name": "john",
 *               "last_name": "doe",
 *               "email": "johndoe@example.com",
 *               "address": "earth",
 *               "dob": "23/01/1999",
 *               "role": "user",
 *               "created_at": "2023-12-27T11:01:14.140Z"
 *                }
 *              }
 *      400:
 *        description:  bad request body
 *        content:
 *          application/json:
 *            example:
 *              {
 *               "success": false,
 *               "error": "password and confirmPassword do not match"
 *              }
 *      409:
 *        description:  user already exists
 *        content:
 *          application/json:
 *            example:
 *              {
 *               "success": false,
 *               "error": "user already exists"
 *              }
 *      500:
 *        description: server error
 *        content:
 *          application/json:
 *            example:
 *              {
 *               "success": false,
 *               "error": "internal server error"
 *              }
 */
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
    .withMessage("invalid date.  use YYYY-MM-DD format"),
  check("password")
    .trim()
    .exists()
    .isStrongPassword()
    .withMessage("password not strong enough"),
  validateMiddleware.validateInput,
  userController.createUser
);

/**
 * @swagger
 *
 * /api/auth/login:
 *  post:
 *    summary: Log in to application
 *    tags:
 *      - authentication
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: successful
 *      400:
 *        description:  bad request body
 */
authRouter.post(
  "/login",
  check("email").exists().notEmpty().isEmail().normalizeEmail(),
  check("password").exists().notEmpty(),
  validateMiddleware.validateInput,
  authMiddleware.authenticateToken,
  authController.login
);

/**
 * @swagger
 *
 * /api/auth/logout:
 *  post:
 *    summary: Log out of appplication
 *    tags:
 *      - authentication
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: successful
 *      400:
 *        description:  bad request body
 */
authRouter.post("/logout", authController.logout);

/**
 * @swagger
 *
 * /api/auth/refresh:
 *  post:
 *    summary: Refresh access tokens
 *    tags:
 *      - authentication
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: successful
 *        content:
 *          application/json:
 *            example:
 *
 *      400:
 *        description:  bad request body
 */
authRouter.post(
  "/refresh",
  authMiddleware.authenticateToken,
  authController.refreshToken
);

/**
 * @swagger
 *
 * /api/auth/forgot-password:
 *  post:
 *    summary: Request to reset password
 *    tags:
 *      - authentication
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: successful
 *      400:
 *        description:  bad request body
 */
authRouter.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 *
 * /api/auth/reset-password/{token}:
 *  post:
 *    summary: Reset password
 *    tags:
 *      - authentication
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: successful
 *      400:
 *        description:  bad request body
 *      409:
 *        description:  user already exists
 */
authRouter.post("/reset-password/:token", authController.resetPassword);

module.exports = authRouter;

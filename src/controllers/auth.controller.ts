import logger from "../config/loggerConfig";
import passwordUtil from "../utils/password.util";
import emailUtil from "../utils/email";
import userModel from "../models/user.model";
import authModel from "../models/auth.model";
import authService from "../services/auth.service";
import { CLIENT_URL } from "../config/index";
import { NextFunction, Request, Response } from "express";
import { validateEmail, validateRegistration } from "../utils/validator";
import {
  BadRequest,
  Conflict,
  InvalidInput,
  NotFound,
  ServerError,
  Unauthorized,
} from "../middleware/error.middleware";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = await validateRegistration(req.body);
    if (errors.length > 0) {
      throw new InvalidInput("Invalid input", errors);
    }

    const { email, firstName } = req.body;
    const existingUser = await userModel.getUser(email);
    if (existingUser) {
      throw new Conflict("User already exists");
    }

    const verifyToken = await authService.sendVerificationMail(
      firstName,
      email,
    );

    if (verifyToken === "") {
      throw new ServerError("internal server error, could not send token");
    }

    const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)

    const user = await authService.registerUser(req.body);

    // don't send hashed password to client
    const userJSON = { ...user, password: undefined };

    await authModel.storeToken(
      user.id,
      verifyToken,
      expiration_timestamp,
      "email",
    );

    res.status(201).json({ success: true, user: userJSON });
  } catch (error) {
    logger.error(`createUser error: ${error}`);
    next(error);
  }
};

const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.params;
    const { email } = req.body;

    const user = await userModel.getUser(email);
    if (!user) {
      throw new NotFound("User not found");
    }

    const existingToken = await authModel.retrieveToken(user.id);
    const currentTimestamp = new Date().getTime();

    // Check if the provided token is invalid
    if (existingToken && existingToken.token_hash !== token) {
      throw new BadRequest("Invalid token");
    }

    // Check if the token has expired
    if (currentTimestamp > existingToken.expiration_timestamp) {
      const verifyToken = await authService.sendVerificationMail(
        user.first_name,
        user.email,
      );
      if (verifyToken === "") {
        throw new ServerError("internal server error, could not send token");
      }

      const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)
      await authModel.storeToken(
        user.id,
        verifyToken,
        expiration_timestamp,
        "email",
      );

      throw new BadRequest("token expired, request for another one");
    }

    await userModel.updateUser({ email: user.email, is_verified: true });

    res.status(200).json({ success: true, message: "email verified" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUser(email);
    if (!user) {
      throw new NotFound("User not found");
    }

    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      throw new InvalidInput("Invalid email", emailErrors);
    }

    const passwordMatch = await passwordUtil.isValidPassword(
      password,
      user.password,
    );
    if (!passwordMatch) {
      throw new Unauthorized("Invalid credentials");
    }

    if (!user.is_verified) {
      const existingToken = await authModel.retrieveToken(user.id);
      const currentTimestamp = new Date().getTime();

      // Check if the token has expired
      if (
        !existingToken ||
        currentTimestamp > existingToken.expiration_timestamp
      ) {
        const verifyToken = await authService.sendVerificationMail(
          user.first_name,
          user.email,
        );
        if (verifyToken === "") {
          throw new ServerError("internal server error, could not send token");
        }

        const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)
        await authModel.storeToken(
          user.id,
          verifyToken,
          expiration_timestamp,
          "email",
        );
      }

      throw new Unauthorized(
        "please verify your email address. A verification link has been sent to your email",
      );
    }

    const token = await authService.generateJwt(user.id);
    res.cookie("jwt", token);
    res.setHeader("Authorization", `Bearer ${token}`);
    // req.session.isAuth = true;

    res.status(201).json({ success: true, token });
  } catch (error) {
    logger.error(`login error: ${error}`);
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      throw new InvalidInput("Invalid email", emailErrors);
    }
    const user = await userModel.getUser(email);
    if (!user) {
      throw new NotFound("User not found");
    }

    const existingToken = await authModel.retrieveToken(user.id);
    const currentTimestamp = new Date().getTime();

    // Check if a reset token has already been sent recently
    if (
      existingToken &&
      existingToken.expiration_timestamp > currentTimestamp
    ) {
      throw new BadRequest("A reset token has already been sent");
    }

    const resetToken = await authService.generateToken();
    const expiration_timestamp = new Date().getTime() + 60 * 60 * 1000; // 1 hour (converted to milliseconds)

    await authModel.storeToken(
      user.id,
      resetToken,
      expiration_timestamp,
      "password",
    );

    const link = `${CLIENT_URL}/api/auth/reset-password/${resetToken}`;

    const emailStatus = await emailUtil.sendEmail(
      email,
      "Password Reset Request",
      { firstName: user.first_name, lastName: user.last_name, link },
      "../../templates/passwordReset.handlebars",
    );

    if (emailStatus !== "sent") {
      throw new ServerError("internal server error, could not send email");
    }

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    logger.error(`forgotPassword error: ${error}`);
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password, email } = req.body;

    const user = await userModel.getUser(email);
    if (!user) {
      throw new NotFound("User not found");
    }

    const existingToken = await authModel.retrieveToken(user.id);
    if (!existingToken || token != existingToken.token_hash) {
      throw new Unauthorized("Invalid token");
    }

    // Hash the new password and update the user
    const hashedPassword = await passwordUtil.hashPassword(password);
    await userModel.updateUser({ email, hashedPassword });

    // Delete the used token
    await authModel.deleteToken(user.id);

    await emailUtil.sendEmail(
      email,
      "Password Reset Successfully",
      {
        firstName: user.first_name,
        lastName: user.last_name,
      },
      "../../templates/passwordResetSuccess.handlebars",
    );

    res
      .status(201)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    logger.error(`resetPassword error: ${error}`);
    next(error);
  }
};

const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO
    res.status(200).end();
  } catch (error) {
    logger.error(`logout error: ${error}`);
    next(error);
  }
};

const refreshToken = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
    // Add logic to refresh the token, involve validating the existing token, generating a new one, and updating the user's session
  } catch (error) {
    logger.error(`refreshToken error: ${error}`);
    next(error);
  }
};

export default {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
};

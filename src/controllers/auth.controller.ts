import { validationResult } from "express-validator";

import logger from "../config/loggerConfig";
import passwordUtil from "../utils/password.util";
import emailUtil from "../utils/emails/email";
import userModel from "../models/user.model";
import authModel from "../models/auth.model";
import authService from "../services/auth.service";
import { CLIENT_URL } from "../config/index";
import { Request, Response } from "express";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array() });
      return;
    }

    const { email } = req.body;
    const existingUser = await userModel.getUser(email);
    if (existingUser) {
      res.status(409).json({ success: false, error: "User already exists" });
      return;
    }

    const user = await authService.registerUser(req.body);

    // Convert to local time zone and format the date as YYYY-MM-DD, because for some reason, node-postgres converts the date to UTC when it reads  from the database
    user.dob = new Date(user.dob).toLocaleDateString("en-CA");
    // don't send hashed password to client
    const userJSON = { ...user, password: undefined };

    const verifyToken = await authService.sendVerificationMail(
      user.first_name,
      user.email,
    );

    if (verifyToken === "") {
      res.status(500).json({
        success: false,
        error: "internal server error",
      });
      return;
    }

    const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)
    await authModel.storeToken(
      user.id,
      verifyToken,
      expiration_timestamp,
      "email",
    );

    res.status(201).json({ success: true, user: userJSON });
  } catch (error) {
    logger.error(`createUser error: ${error}`);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { email } = req.body;

    const user = await userModel.getUser(email);
    if (!user) {
      res.status(404).json({ success: false, error: "user not found" });
      return;
    }

    const existingToken = await authModel.retrieveToken(user.id);
    const currentTimestamp = new Date().getTime();

    // Check if the provided token is invalid
    console.log(existingToken.token_hash);
    console.log(token);
    if (existingToken && existingToken.token_hash !== token) {
      res.status(409).json({ success: false, error: "Invalid token" });
      return;
    }

    // Check if the token has expired
    if (currentTimestamp > existingToken.expiration_timestamp) {
      const verifyToken = await authService.sendVerificationMail(
        user.first_name,
        user.email,
      );
      if (verifyToken === "") {
        res.status(500).json({
          success: false,
          error: "internal server error, could not send token",
        });
        return;
      }

      const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)
      await authModel.storeToken(
        user.id,
        verifyToken,
        expiration_timestamp,
        "email",
      );

      res.status(400).json({
        success: false,
        error: "token expired, sending new link",
      });
      return;
    }

    await userModel.updateUser({ email: user.email, is_verified: true });

    res.status(200).json({ success: true, message: "email verified" });
  } catch (error) {
    logger.error(error);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUser(email);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const passwordMatch = await passwordUtil.isValidPassword(
      password,
      user.password,
    );
    if (!passwordMatch) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    if (!user.is_verified) {
      const existingToken = await authModel.retrieveToken(user.id);
      const currentTimestamp = new Date().getTime();

      // // Check if the provided token is invalid
      // console.log(existingToken.token_hash)
      // console.log(token)
      // if (existingToken && existingToken.token_hash !== token) {
      //   return res.status(409).json({ success: false, error: "Invalid token" });
      // }

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
          res.status(500).json({
            success: false,
            error: "internal server error, could not send token",
          });
          return;
        }

        const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)
        await authModel.storeToken(
          user.id,
          verifyToken,
          expiration_timestamp,
          "email",
        );
      }

      res.status(401).json({
        success: false,
        error:
          "please verify your email address. A verification link has been sent to your email",
      });
      return;
    }

    const token = await authService.generateJwt(user.id);
    res.cookie("jwt", token);
    res.setHeader("Authorization", `Bearer ${token}`);
    // req.session.isAuth = true;

    res.status(201).json({ success: true, token });
  } catch (error) {
    logger.error(`login error: ${error}`);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await userModel.getUser(email);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const existingToken = await authModel.retrieveToken(user.id);
    const currentTimestamp = new Date().getTime();

    // Check if a reset token has already been sent recently
    if (
      existingToken &&
      existingToken.expiration_timestamp > currentTimestamp
    ) {
      res.status(409).json({
        success: false,
        error: "Reset token already sent, please check email",
      });
      return;
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
      "./templates/passwordReset.handlebars",
    );

    if (emailStatus !== "sent") {
      res.status(500).json({
        success: false,
        error: "internal server error",
      });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    logger.error(`forgotPassword ${error}`);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password, email } = req.body;

    const user = await userModel.getUser(email);
    if (!user) {
      res.status(404).json({ success: false, error: "user not found" });
      return;
    }

    const existingToken = await authModel.retrieveToken(user.id);
    if (!existingToken || token != existingToken.token_hash) {
      res.status(401).json({ success: false, error: "invalid token" });
      return;
    }

    // const currentTimestamp = new Date().getTime();
    // if (currentTimestamp > hashedToken.expiration_timestamp) {
    //   await authModel.deleteToken(user.id);
    //   return res.status(400).json({
    //     success: false,
    //     error: "token expired, request for another one",
    //   });
    // }

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
      "./templates/passwordResetSuccess.handlebars",
    );

    res.status(201).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const logout = async (_req: Request, res: Response) => {
  try {
    // TODO
    res.status(204).end();
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const refreshToken = async (_req: Request, res: Response) => {
  try {
    // TODO
    // Add logic to refresh the token, involve validating the existing token, generating a new one, and updating the user's session
    // res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal server error" });
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

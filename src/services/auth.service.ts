import passwordUtil from "../utils/password";
import userModel from "../models/user.model";
import { User } from "../types/user.types";
import {
  BadRequest,
  Conflict,
  InvalidInput,
  ResourceNotFound,
  ServerError,
  Unauthorized,
} from "../middleware/error.middleware";
import authModel from "../models/auth.model";
import { sendEmail, sendVerificationMail } from "../utils/email";
import { generateJwt, generateToken } from "../utils/token";
import { validateEmail, validatePassword } from "../utils/validator";
import { CLIENT_URL } from "../config";

export class AuthService {
  async registerUser(userData: User) {
    const { email } = userData;

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      throw new Conflict("User already exists");
    }

    const verifyToken = await sendVerificationMail(
      userData.firstName,
      userData.email,
    );

    if (verifyToken === "") {
      throw new ServerError("internal server error, could not send token");
    }

    const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour (converted to milliseconds)

    // Hash the password before storing it in the database
    userData.password = await passwordUtil.hashPassword(userData.password);
    const user = await userModel.createUser(userData);

    await authModel.storeToken(
      user.id,
      verifyToken,
      expiration_timestamp,
      "email",
    );

    return user;
  }

  async verifyEmail(email: string, token: string) {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    const existingToken = await authModel.retrieveToken(user.id);
    const currentTimestamp = new Date().getTime();

    // Check if the provided token is invalid
    if (existingToken && existingToken.token_hash !== token) {
      throw new BadRequest("Invalid token");
    }

    // Check if the token has expired
    if (currentTimestamp > existingToken.expiration_timestamp) {
      throw new BadRequest("token expired, request for another one");
    }

    await userModel.updateUser(user.id, {
      email: user.email,
      isVerified: true,
    });
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFound("User not found");
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

    if (!user.isVerified) {
      // Resend the verification email
      const existingToken = await authModel.retrieveToken(user.id);
      const currentTimestamp = new Date().getTime();

      // Check if the token has expired
      if (
        !existingToken ||
        currentTimestamp > existingToken.expiration_timestamp
      ) {
        const verifyToken = await sendVerificationMail(
          user.firstName,
          user.email,
        );
        if (verifyToken === "") {
          throw new ServerError("internal server error, could not send token");
        }

        const expiration_timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 hour
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

    const token = await generateJwt(user.id, user.role);

    return { user, token };
  }

  async forgotPassword(email: string) {
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      throw new InvalidInput("Invalid email", emailErrors);
    }
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFound("User not found");
    }
    console.log(user);

    const existingToken = await authModel.retrieveToken(user.id);
    const currentTimestamp = new Date().getTime();

    // Check if a reset token has already been sent recently
    if (
      existingToken &&
      existingToken.expiration_timestamp > currentTimestamp
    ) {
      throw new BadRequest("A reset token has already been sent");
    }

    const resetToken = await generateToken();
    const expiration_timestamp = new Date().getTime() + 60 * 60 * 1000; // 1 hour (converted to milliseconds)

    await authModel.storeToken(
      user.id,
      resetToken,
      expiration_timestamp,
      "password",
    );

    const link = `${CLIENT_URL}/api/auth/reset-password/${resetToken}`;

    const emailStatus = await sendEmail(
      email,
      "Password Reset Request",
      { firstName: user.firstName, lastName: user.lastName, link },
      "../../templates/passwordReset.handlebars",
    );

    if (emailStatus !== "sent") {
      throw new ServerError("internal server error, could not send email");
    }
  }

  async resetPassword(email: string, token: string, password: string) {
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      throw new InvalidInput("invalid email", emailErrors);
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      throw new InvalidInput("invalid password", passwordErrors);
    }

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    const existingToken = await authModel.retrieveToken(user.id);
    console.log(existingToken);
    if (!existingToken || token != existingToken.token_hash) {
      throw new Unauthorized("Invalid token");
    }

    // Hash the new password and update the user
    const hashedPassword = await passwordUtil.hashPassword(password);
    await userModel.updateUser(user.id, { email, password: hashedPassword });

    // Delete the used token
    await authModel.deleteToken(user.id);

    await sendEmail(
      email,
      "Password Reset Successfully",
      {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      "../../templates/passwordResetSuccess.handlebars",
    );
  }
}

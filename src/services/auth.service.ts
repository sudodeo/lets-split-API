import jwt from "jsonwebtoken";
import crypto from "crypto";

import logger from "../config/loggerConfig";
import { JWT_SECRET, CLIENT_URL } from "../config/index";
import passwordUtil from "../utils/password.util";
import userModel from "../models/user.model";
import emailUtil from "../utils/email";
import { User } from "../types/user.types";

const registerUser = async (userData: User) => {
  // Hash the password before storing it in the database
  userData.password = await passwordUtil.hashPassword(userData.password);
  const user = await userModel.createUser(userData);

  return user;
};

const sendVerificationMail = async (firstName: string, email: string) => {
  const verifyToken = await generateToken();
  const link = `${CLIENT_URL}/api/auth/verify/${verifyToken}`;
  const emailStatus = await emailUtil.sendEmail(
    email,
    "Verify Email",
    { firstName, link },
    "../../templates/verifyMail.handlebars"
  );

  if (emailStatus !== "sent") {
    return "";
  }
  return verifyToken;
};

const generateJwt = (id: string) => {
  const maxAge = "1h";
  return jwt.sign(
    {
      sub: id,
      iat: new Date().getTime(),
      iss: "authService",
      aud: "SplitCrew",
    },
    JWT_SECRET as string,
    { expiresIn: maxAge }
  );
};

const verifyJwt = (token: string) => {
  let verified = false;
  try {
    jwt.verify(token.replace("Bearer ", ""), JWT_SECRET as string);
    // console.log(t);
  } catch (error) {
    logger.error(`verifyJwt error: ${error}`);
  }
  return verified;
};

const refreshJwt = (_token: string) => {
  // TODO
};

const generateToken = async () => {
  const token = crypto.randomBytes(32).toString("hex");
  // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return token;
};

export default {
  registerUser,
  sendVerificationMail,
  refreshJwt,
  generateJwt,
  verifyJwt,
  generateToken,
};

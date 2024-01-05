import jwt from "jsonwebtoken";
import crypto from "crypto";

import logger from "../config/loggerConfig.js";
import { JWT_SECRET, CLIENT_URL } from "../config/index.js";
import passwordUtil from "../utils/password.util.js";
import userModel from "../models/user.model.js";
import emailUtil from "../utils/emails/email.js";

const registerUser = async (userData) => {
  // Hash the password before storing it in the database
  userData.password = await passwordUtil.hashPassword(userData.password);
  const user = await userModel.createUser(userData);

  return user;
};

const sendVerificationMail = async (firstName, email) => {
  const verifyToken = await generateToken();
  const link = `${CLIENT_URL}/api/auth/verify/${verifyToken}`;
  const emailStatus = await emailUtil.sendEmail(
    email,
    "Verify Email",
    { firstName, link },
    "./templates/verifyMail.handlebars"
  );

  if (emailStatus !== "sent") {
    return "";
  }
  return verifyToken;
};

const generateJwt = (id) => {
  const maxAge = "1h";
  return jwt.sign(
    {
      sub: id,
      iat: new Date().getTime(),
      iss: "authService",
      aud: "SplitEase",
    },
    JWT_SECRET,
    { expiresIn: maxAge }
  );
};

const verifyJwt = (token) => {
  let verified = false;
  try {
    decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
  } catch (error) {
    logger.error(`verifyJwt error: ${error}`);
  }
  return verified;
};

const refreshJwt = (token) => {
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

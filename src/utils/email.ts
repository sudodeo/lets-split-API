import fs from "fs";
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import path from "path";

import {
  GMAIL_USERNAME,
  GMAIL_APP_PASSWORD,
  CLIENT_URL,
} from "../config/index";
import logger from "../config/loggerConfig";
import { generateToken } from "./token";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  payload: Object,
  template: string
) => {
  try {
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = Handlebars.compile(source);
    const mailOptions = {
      from: GMAIL_USERNAME,
      to: email,
      subject,
      html: compiledTemplate(payload),
    };
    await transporter.sendMail(mailOptions);
    return "sent";
  } catch (error) {
    logger.error(error);
    return "failed";
  }
};

export const sendVerificationMail = async (
  firstName: string,
  email: string
) => {
  try {
    const verifyToken = await generateToken();
    const link = `${CLIENT_URL}/api/auth/verify/${verifyToken}`;
    
    const emailStatus = await sendEmail(
      email,
      "Verify Email",
      { firstName, link },
      "../../templates/verifyMail.handlebars"
    );
    
    if (emailStatus !== "sent") {
      throw new Error("Email sending failed");
    }

    return verifyToken;
  } catch (error) {
    logger.error(error);
    return "";
  }
};

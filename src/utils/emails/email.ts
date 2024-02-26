import fs from "fs";
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import path from "path";

import { GMAIL_USERNAME, GMAIL_APP_PASSWORD } from "../../config/index";
import logger from "../../config/loggerConfig";

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
  template: string,
) => {
  const source = fs.readFileSync(path.join(__dirname, template), "utf8");
  const compiledTemplate = Handlebars.compile(source);
  const mailOptions = {
    from: GMAIL_USERNAME,
    to: email,
    subject,
    html: compiledTemplate(payload),
  };
  await transporter.sendMail(mailOptions, (error, _): string => {
    if (error) {
      logger.error(error);
      return "failed";
    }
    return "sent";
  });
  return "sent";
};

export default {
  sendEmail,
};

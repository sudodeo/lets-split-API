import winston from "winston";
import path from "path";

import { NODE_ENV } from "./index";

const logDirectory = path.join(__dirname, "../../logs");

const customColors = {
  error: "red",
  warn: "yellow",
  info: "magenta",
  debug: "cyan",
};

let level = "info";

if (NODE_ENV === "dev") {
  level = "debug";
}

const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.prettyPrint(),
    winston.format.align(),
    winston.format.colorize({ level: true, colors: customColors }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true, colors: customColors }),
      ),
    }),
    new winston.transports.File({
      filename: `${logDirectory}/combined.log`,
      level: "info",
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 15,
      format: winston.format.combine(
        winston.format.colorize({ level: true, colors: customColors }),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: `${logDirectory}/errors.log`,
      level: "error",
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 15,
      format: winston.format.combine(
        winston.format.colorize({ level: true, colors: customColors }),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;

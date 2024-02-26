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
// const errorStackTracerFormat = winston.format((info) => {
//   if (info.meta && info.meta instanceof Error) {
//     info.message = `${info.message} ${info.meta.stack}`;
//   }
//   return info;
// });

const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.simple(),
    // winston.format.printf((info) => {
    //   const { timestamp, level, message, ...meta } = info;
    //   return `${timestamp} [${level}]: ${message} ${
    //     Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    //   }`;
    // })
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

// // Extend the logger with a dynamic log level change function
// logger.setLogLevel = (newLevel) => {
//   if (Object.keys(customColors).includes(newLevel)) {
//     logger.level = newLevel;
//   } else {
//     logger.warn(
//       `Invalid log level: ${newLevel}. Keeping the current level: ${logger.level}`
//     );
//   }
// };

export default logger;

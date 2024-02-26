import dotenv from "dotenv";
dotenv.config();

const envVariables = [
  "PORT",
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
  "DB_CONN_STRING",
  "JWT_SECRET",
  "NODE_ENV",
  "TEST_SERVER",
  "SESSION_SECRET",
  "CLIENT_URL",
  "GMAIL_USERNAME",
  "GMAIL_APP_PASSWORD",
];

for (const variable of envVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined in .env file`);
  }
}

const {
  PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_CONN_STRING,
  JWT_SECRET,
  NODE_ENV,
  TEST_SERVER,
  SESSION_SECRET,
  CLIENT_URL,
  GMAIL_USERNAME,
  GMAIL_APP_PASSWORD,
} = process.env;

export {
  PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_CONN_STRING,
  JWT_SECRET,
  NODE_ENV,
  TEST_SERVER as testServer,
  SESSION_SECRET,
  CLIENT_URL,
  GMAIL_USERNAME,
  GMAIL_APP_PASSWORD,
};

import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  JWT_SECRET,
  NODE_ENV,
  TEST_SERVER,
} = process.env;

export {
  PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  JWT_SECRET,
  NODE_ENV,
  TEST_SERVER as testServer,
};

require("dotenv").config();

const {
  PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  JWT_SECRET,
  NODE_ENV,
} = process.env;

module.exports = {
  PORT,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  JWT_SECRET,
  NODE_ENV,
};

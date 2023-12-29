const { DB_USER, DB_NAME, DB_PASSWORD, DB_PORT, DB_HOST } = require("./index")

module.exports = {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
};

import {
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST,
  NODE_ENV,
  DB_CONN_STRING,
} from "./index.js";
let connectionString;

if (NODE_ENV == "dev") {
  connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
} else if (NODE_ENV === "prod") {
  connectionString = DB_CONN_STRING;
}

export { connectionString };

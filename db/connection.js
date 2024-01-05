import pg from "pg";

import * as dbConfig from "../src/config/dbConfig.js";
import logger from "../src/config/loggerConfig.js";

const pool = new pg.Pool(dbConfig);
pool.on("error", (error) => {
  logger.error(`PostgreSQL connection pool error: ${error}`);
  pool.end();
});

export default pool;

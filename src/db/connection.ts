import pg from "pg";

import * as dbConfig from "../config/dbConfig.js";
import logger from "../config/loggerConfig.js";

const pool = new pg.Pool(dbConfig);
pool.on("error", (error: any) => {
  logger.error(`PostgreSQL connection pool error: ${error}`);
  pool.end();
});

export default pool;

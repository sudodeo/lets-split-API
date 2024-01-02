import pg from "pg";
import * as dbConfig from "../src/config/dbConfig.js";
const pool = new pg.Pool(dbConfig);

pool.on("error", (error) => {
  console.log(error);
  process.exit(-1);
});

export default pool;

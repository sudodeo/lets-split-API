const pg = require("pg");
const dbConfig = require("./config/dbConfig");
const pool = new pg.Pool(dbConfig);

pool.on("error", (err) => {
  console.log(err);
  process.exit(-1);
});

module.exports = pool

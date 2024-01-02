const pool = require("../../db/connection");

exports.getCurrencies = async () => {
  const client = await pool.connect();
  try {
    results = await client.query("SELECT currency_code FROM currencies;");
    return results.rows;
  } catch (error) {
    throw error;
  }
};

import pool from "../../db/connection.js";

const getCurrencies = async () => {
  const client = await pool.connect();
  try {
    let results = await client.query("SELECT currency_code FROM currencies;");
    return results.rows;
  } catch (error) {
    throw error;
  }
};

export default { getCurrencies };

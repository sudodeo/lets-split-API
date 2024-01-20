import pool from "../../db/connection.js";

const getCurrencies = async () => {
  const client = await pool.connect();
  try {
    let results = await client.query("SELECT currency_code FROM currencies;");
    return results.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release;
  }
};

const getCurrency = async (currencyCode) => {
  const client = await pool.connect();
  try {
    const currency = await client.query(
      "SELECT * FROM currencies WHERE currency_code=$1;",
      [currencyCode]
    );
    return currency.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release;
  }
};
export default { getCurrencies, getCurrency };

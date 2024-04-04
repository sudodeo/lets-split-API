import pool from "../db/connection";

const getCurrencies = async () => {
  const client = await pool.connect();
  try {
    const results = await client.query("SELECT currency_code FROM currencies;");
    return results.rows;
  } finally {
    client.release();
  }
};

const getCurrency = async (currencyCode: string) => {
  const client = await pool.connect();
  try {
    const currency = await client.query(
      "SELECT * FROM currencies WHERE currency_code=$1;",
      [currencyCode],
    );
    return currency.rows[0];
  } finally {
    client.release();
  }
};
export default { getCurrencies, getCurrency };

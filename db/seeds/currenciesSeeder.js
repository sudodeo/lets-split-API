const pool = require("../connection");

const currencies = ["NGN", "USD", "GBP"];

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN;");

    for (const currency of currencies) {
      try {
        await client.query(
          "INSERT INTO currencies (currency_code) VALUES ($1);",
          [currency]
        );
      } catch (error) {
        // check if error is duplicate field error
        if (error.code === "23505") {
          continue;
        }
      }
    }
    await client.query("COMMIT");
    console.log("Database seeded successfully!");
  } catch (error) {
    await client.query("ROLLBACK;");
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
};

module.exports = { currencies, seedDatabase };

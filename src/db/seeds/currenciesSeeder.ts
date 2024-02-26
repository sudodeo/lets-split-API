import pool from "../connection.js";
import logger from "../../config/loggerConfig.js";

const currencies = ["NGN", "USD", "GBP"];

export const populateCurrencyTable = async () => {
  const client = await pool.connect();

  try {
    // Delete all rows from the table without dropping it
    await client.query("DROP TABLE IF EXISTS currencies  cascade;");

    await client.query(
      "CREATE TABLE currencies (id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,currency_code varchar(3) UNIQUE,is_active boolean default true);",
    );
    for (const currency of currencies) {
      try {
        await client.query(
          "INSERT INTO currencies (currency_code) VALUES ($1);",
          [currency],
        );
      } catch (error: any) {
        // Check if error is a unique violation (duplicate key)
        if (error.code === "23505") {
          continue;
        } else {
          logger.error(`currency insert error: ${error}`);
          throw error;
        }
      }
    }

    logger.info("Database seeded successfully!");
  } catch (error: any) {
    logger.error(`Error seeding database: ${error.message}`);
  } finally {
    client.release();
  }
};

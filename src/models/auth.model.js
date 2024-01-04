import pool from "../../db/connection.js";
import logger from "../config/loggerConfig.js";

const storeToken = async (user_id, token, expiration_timestamp, token_type) => {
  const client = await pool.connect();
  try {
    console.log(typeof expiration_timestamp);
    const storedToken = await client.query(
      "INSERT INTO tokens(user_id,token_hash, expiration_timestamp, token_type) VALUES ($1,$2,(to_timestamp($3 / 1000.0)), $4) RETURNING *;",
      [user_id, token, expiration_timestamp, token_type]
    );

    return storedToken.rows[0];
  } catch (error) {
    logger.error("Error storing token:", error);
    throw error;
  } finally {
    client.release();
  }
};

const retrieveToken = async (user_id) => {
  const client = await pool.connect();
  try {
    const foundToken = await client.query(
      "SELECT * FROM tokens WHERE user_id=$1",
      [user_id]
    );
    return foundToken.rows[0];
  } catch (error) {
    logger.error("Error retrieving token:", error);
    throw error;
  } finally {
    client.release();
  }
};

const deleteToken = async (user_id) => {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM tokens WHERE user_id=$1;", [user_id]);
  } catch (error) {
    console.error("Error deleting token:", error);
    throw error;
  } finally {
    client.release();
  }
};

export default { retrieveToken, storeToken, deleteToken };

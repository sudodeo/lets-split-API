import pool from "../../db/connection.js";
import logger from "../config/loggerConfig.js";

const getAllUsers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users;");
    return result.rows;
  } catch (error) {
    logger.error(`getAllUsers db error: ${error}`);
    return { users: [], error };
  } finally {
    client.release();
  }
};

const getUser = async (email) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE email=$1;", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    logger.error(`getUser db error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
};

const createUser = async (userData) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO users(first_name, last_name, email, password, address, dob) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;",
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.address,
        userData.dob,
      ]
    );

    return result.rows[0];
  } catch (error) {
    logger.error(`createUser db error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
};

const editUser = async (data) => {
  const client = await pool.connect();
  const keys = data.keys;
  const values = data.values;
  try {
    const result = await client.query("UPDATE users");

    return;
  } catch (error) {
    logger.error(`editUser db error: ${error}`);
    throw error;
  }
};

export default { getAllUsers, getUser, createUser, editUser };

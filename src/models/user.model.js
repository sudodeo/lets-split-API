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

const updateUser = async (data) => {
  const client = await pool.connect();
  const keys = Object.keys(data);
  try {
    const setClause = keys.map((key) => `${key}='${data[key]}'`).join(", ");

    const query = `UPDATE users SET ${setClause} WHERE email ='${data.email}' RETURNING *;`;

    const result = await client.query(`${query}`);

    return result.rows[0];
  } catch (error) {
    logger.error(`updateUser db error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
};

export default { getAllUsers, getUser, createUser, updateUser };

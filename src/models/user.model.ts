import pool from "../db/connection";
import logger from "../config/loggerConfig";
import { UpdateUser, User } from "../types/user.types";

const getAllUsers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, first_name, last_name, email, address, dob, role, is_verified, created_at FROM users;"
    );
    return result.rows;
  } catch (error) {
    logger.error(`getAllUsers db error: ${error}`);
    return [];
  } finally {
    client.release();
  }
};

const getUserByEmail = async (email: string): Promise<User> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, first_name, last_name, email, address, dob, role, is_verified, created_at FROM users WHERE email=$1;",
      [email]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(`getUserByEmail db error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
};

const getUserByID = async (id: string): Promise<User> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, first_name, last_name, email, address, dob, role, is_verified, created_at FROM users WHERE id=$1;",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(`getUserByID db error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
};

const createUser = async (user: User): Promise<User> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO users(first_name, last_name, email, password, address, dob) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, address, dob, role, is_verified, created_at;",
      [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.address,
        user.dob,
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

const updateUser = async (id: String, user: UpdateUser): Promise<User> => {
  const client = await pool.connect();
  const keys = Object.keys(user);
  try {
    const setClause = keys.map((key) => `${key}='${user[key]}'`).join(", ");

    const query = `UPDATE users SET ${setClause} WHERE id ='${id}' RETURNING id, first_name, last_name, email, address, dob, role, is_verified, created_at;;`;

    const result = await client.query(`${query}`);

    return result.rows[0];
  } catch (error) {
    logger.error(`updateUser db error: ${error}`);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  getAllUsers,
  getUserByEmail,
  getUserByID,
  createUser,
  updateUser,
};

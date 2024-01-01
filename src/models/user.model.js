const pool = require("../../db/connection");

// Function to retrieve all users from the database
const getAllUsers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users;");
    return result.rows;
  } catch (err) {
    return { users: [], err };
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
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

// Function to create a new user in the database
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
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// TODO: modify user (patch)

module.exports = {
  getAllUsers,
  getUser,
  createUser,
};

import { populateCurrencyTable } from "./currenciesSeeder.js";
// import pool from "../connection.js";

const seedDatabase = async () => {
  await populateCurrencyTable();
};

export default seedDatabase

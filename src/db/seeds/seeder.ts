import { populateCurrencyTable } from "./currenciesSeeder";
// import pool from "../connection.js";

const seedDatabase = async () => {
  await populateCurrencyTable();
};

export default seedDatabase;

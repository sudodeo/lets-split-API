import { populateCurrencyTable } from "./currenciesSeeder";

const seedDatabase = async () => {
  await populateCurrencyTable();
};

export default seedDatabase;

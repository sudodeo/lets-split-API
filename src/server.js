const app = require("./app");
const seeder = require("../db/seeds/currenciesSeeder")


const { PORT } = require("./config/index");

app.listen(PORT, async () => {
  await seeder.seedDatabase()
  console.log(`Server running on port ${PORT}`);
});

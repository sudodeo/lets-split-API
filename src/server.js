import app from "./app.js";
import { seedDatabase } from "../db/seeds/currenciesSeeder.js";

import { PORT } from "./config/index.js";

app.listen(PORT, async () => {
  await seedDatabase();
  console.log(`Server running on port ${PORT}`);
});

export default { server: app };

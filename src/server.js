import app from "./app.js";
import { seedDatabase } from "../db/seeds/currenciesSeeder.js";
import logger from "./config/loggerConfig.js";

import { PORT } from "./config/index.js";

app.listen(PORT, async () => {
  await seedDatabase();
  logger.debug(`Server running on port ${PORT}`);
});

export default { server: app };

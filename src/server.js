const app = require("./app");

const { PORT } = require("./config/index");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

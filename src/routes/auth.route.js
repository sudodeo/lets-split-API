const authRouter = require("express").Router();

// registration, login, password reset, token refresh, logout
authRouter.post("/register", (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, dateOfbirth, address } = req.body; // add phoneNumber later
  

});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
});

module.exports = authRouter;

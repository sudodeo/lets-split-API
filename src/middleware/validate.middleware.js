const { validationResult } = require("express-validator");

exports.validateInput = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let error = {};
    let errors = result.errors
    errors.map((err) => (error[err.path] = err.msg));
    return res.status(422).json({ error });
  }
  next();
};

import { validationResult } from "express-validator";

const validateInput = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let error = {};
    let errors = result.errors;
    errors.map((err) => (error[err.path] = err.msg));
    return res.status(400).json({ success: false, error });
  }
  next();
};

export default {validateInput}
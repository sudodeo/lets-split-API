import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

const validateInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let error = {};
    // let errors = result.errors;
    // errors.map((err) => (error[err.path] = err.msg));
    return res.status(400).json({ success: false, error });
  }
  next();
};

export default { validateInput };

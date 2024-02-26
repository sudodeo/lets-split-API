import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

const validateInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let error = {};
    // let errors = result.errors;
    // errors.map((err) => (error[err.path] = err.msg));
    res.status(400).json({ success: false, error });
    return;
  }
  next();
};

export default { validateInput };

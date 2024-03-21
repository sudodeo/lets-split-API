import { NextFunction, Request, Response } from "express";
import { getAllowedMethodsForEndpoint } from "./httpMethodHandler";

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INVALID_INPUT = 422,
  INTERNAL_SERVER_ERROR = 500,
}

class AppError extends Error {
  public status: HttpCode;
  public error: Record<string, any>;

  constructor(
    statusCode: HttpCode,
    message: string,
    error: Record<string, any> = {}
  ) {
    super(message);
    this.status = statusCode;
    this.error = error;
  }
}

export class BadRequest extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.BAD_REQUEST, message, error);
  }
}

export class Unauthorized extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.UNAUTHORIZED, message, error);
  }
}

export class Forbidden extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.FORBIDDEN, message, error);
  }
}

export class ResourceNotFound extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.NOT_FOUND, message, error);
  }
}

export class Conflict extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.CONFLICT, message, error);
  }
}

export class InvalidInput extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.INVALID_INPUT, message, error);
  }
}

export class ServerError extends AppError {
  constructor(message: string, error?: Record<string, any>) {
    super(HttpCode.INTERNAL_SERVER_ERROR, message, error);
  }
}

export const routeNotFound = (req: Request, res: Response) => {
  res.status(HttpCode.NOT_FOUND).json({
    message: "Requested route does not exist",
    path: req.url,
  });
};

export const methodNotAllowed = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedMethods = getAllowedMethodsForEndpoint(req.path);
  if (allowedMethods.length === 0) {
    // endpoint does not exist
    return next();
  }

  if (!allowedMethods.includes(req.method)) {
    res.status(HttpCode.METHOD_NOT_ALLOWED).json({
      success: false,
      error: "Method Not Allowed",
      message: `The requested method '${req.method}' is not allowed for this endpoint.`,
      allowedMethods,
    });
  }
  next();
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const payload = {
    success: false,
    message: err.message,
    details: err.error,
  };

  if (!err.status) {
    err.status = HttpCode.INTERNAL_SERVER_ERROR;
    payload.message = "Internal server error";
  }

  res.status(err.status).json(payload);
};

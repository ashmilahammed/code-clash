import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { logger } from "../../infrastructure/services/logger";

export const errorMiddleware = (
  err: Error & { statusCode?: number; isOperational?: boolean },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.COMMON.INTERNAL_ERROR;

  // Log error using Winston Logger
  logger.error(`${req.method} ${req.url} - ${message}`, {
    stack: !err.isOperational ? err.stack : undefined,
    method: req.method,
    url: req.url,
    statusCode
  });

  // Mongoose validation or cast errors could be handled here specifically
  if (err.name === "ValidationError") {
      statusCode = HttpStatus.BAD_REQUEST;
  }

  res.status(statusCode).json(
    ApiResponse.error(message, process.env.NODE_ENV === 'development' ? err.stack : undefined)
  );
};


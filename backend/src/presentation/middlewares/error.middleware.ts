import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

export const errorMiddleware = (
  err: Error & { statusCode?: number; isOperational?: boolean },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.COMMON.INTERNAL_ERROR;

  // Log error for debugging (can use WinstonLogger here)
  console.error(`[Error] ${req.method} ${req.url} - ${message}`);
  if (!err.isOperational) {
    console.error(err.stack);
  }

  // Mongoose validation or cast errors could be handled here specifically
  if (err.name === "ValidationError") {
      statusCode = HttpStatus.BAD_REQUEST;
  }

  res.status(statusCode).json(
    ApiResponse.error(message, process.env.NODE_ENV === 'development' ? err.stack : undefined)
  );
};

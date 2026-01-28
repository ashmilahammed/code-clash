import winston from "winston";

// Logger abstraction (interface)
export interface Logger {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}

// Winston logger instance
const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File output
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Concrete implementation
export class WinstonLogger implements Logger {
  info(message: string, meta?: unknown): void {
    winstonLogger.info(message, meta ? { meta } : undefined);
  }

  warn(message: string, meta?: unknown): void {
    winstonLogger.warn(message, meta ? { meta } : undefined);
  }

  error(message: string, meta?: unknown): void {
    winstonLogger.error(message, meta ? { meta } : undefined);
  }
}

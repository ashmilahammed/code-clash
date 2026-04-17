import rateLimit from "express-rate-limit";

// auth
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per 15 minutes
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// code execution
export const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // only 15 executions per minute
  message: {
    success: false,
    message: "Too many code executions. Please wait.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
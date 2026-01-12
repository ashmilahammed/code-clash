export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Invalid email or password",

  USER_NOT_FOUND: "No account is registered with this email",

  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",

  EMAIL_ALREADY_REGISTERED: "An account with this email already exists",

  USER_BLOCKED: "Your account has been blocked by admin",

  EMAIL_NOT_VERIFIED: "Please verify your OTP before logging in",

  GOOGLE_ONLY_ACCOUNT: "This account was created using Google. Please sign in with Google.",

  INVALID_OTP: "Invalid OTP. Please try again",
  OTP_EXPIRED: "OTP expired. Please request a new one",

  INVALID_OR_EXPIRED_OTP: "Invalid or expired OTP",

  UNAUTHORIZED: "You are not authorized",
  FORBIDDEN: "Access denied",

  DEFAULT: "Something went wrong. Please try again",
};



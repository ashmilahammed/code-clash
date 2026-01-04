export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logged out successfully",

    OTP_SENT: "OTP sent to email",
    OTP_VERIFIED: "OTP verified successfully",
    OTP_RESENT: "OTP resent successfully",

    ACCOUNT_BLOCKED: "Your account has been blocked by admin",
    ACCOUNT_NOT_VERIFIED: "Please verify your OTP before logging in",
    INVALID_CREDENTIALS: "Invalid email or password",

    GOOGLE_LOGIN_SUCCESS: "Google login successful",
    SESSION_EXPIRED: "Session expired, please login again",
    UNAUTHORIZED: "Unauthorized access",
  },

  USER: {
    FETCH_SUCCESS: "User fetched successfully",
    UPDATE_SUCCESS: "User updated successfully",
  },

  ADMIN: {
    USER_BLOCKED: "User blocked successfully",
    USER_UNBLOCKED: "User unblocked successfully",
  },

  COMMON: {
    BAD_REQUEST: "Bad request",
    INTERNAL_ERROR: "Something went wrong",
    FORBIDDEN: "You are not allowed to access this resource",
    NOT_FOUND: "Resource not found",
  },
} as const;

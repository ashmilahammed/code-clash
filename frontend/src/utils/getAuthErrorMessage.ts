import { AUTH_ERROR_MESSAGES } from "../constants/authErrorMessages";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export function getAuthErrorMessage(err: unknown): string {
  const error = err as ApiError;
  
  const code = error?.response?.data?.message;
  const status = error?.response?.status;

  // Blocked user (status-based)
  if (status === 403 || code === "ACCOUNT_BLOCKED") {
    return AUTH_ERROR_MESSAGES.USER_BLOCKED;
  }

  // Login errors
  if (code === "USER_NOT_FOUND") {
    return AUTH_ERROR_MESSAGES.USER_NOT_FOUND;
  }

  if (code === "PASSWORD_TOO_SHORT") {
    return "Password must be at least 6 characters";
  }

  if (code === "ACCOUNT_NOT_VERIFIED") {
    return AUTH_ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
  }

  if (code === "GOOGLE_ONLY_ACCOUNT") {
    return AUTH_ERROR_MESSAGES.GOOGLE_ONLY_ACCOUNT;
  }

  if (code === "INVALID_CREDENTIALS") {
    return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
  }

  if (code === "CURRENT_PASSWORD_INCORRECT") {
    return AUTH_ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT;
  }

  // Register
  if (code === "EMAIL_ALREADY_REGISTERED") {
    return AUTH_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED;
  }

  // OTP flows
  if (code === "INVALID_OTP") {
    return AUTH_ERROR_MESSAGES.INVALID_OTP;
  }

  if (code === "OTP_EXPIRED") {
    return AUTH_ERROR_MESSAGES.OTP_EXPIRED;
  }

  if (code === "INVALID_OR_EXPIRED_OTP") {
    return AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_OTP;
  }

  return AUTH_ERROR_MESSAGES.DEFAULT;
}

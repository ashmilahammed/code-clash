// import { AUTH_ERROR_MESSAGES } from "../constants/authErrorMessages";

// export function getAuthErrorMessage(err: any): string {
//   const code = err?.response?.data?.message;
//   const status = err?.response?.status;

//   // Blocked user
//   if (status === 403) {
//     return AUTH_ERROR_MESSAGES.USER_BLOCKED;
//   }

//   // Register
//   if (code === "EMAIL_ALREADY_REGISTERED") {
//     return AUTH_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED;
//   }

//   // Login: email not verified
//   if (code === "EMAIL_NOT_VERIFIED" || code === "OTP_REQUIRED") {
//     return AUTH_ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
//   }

//   // OTP 
//   if (code === "INVALID_OR_EXPIRED_OTP") {
//     return AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_OTP;
//   }

//   // 
//   if (code === "INVALID_OTP") {
//     return AUTH_ERROR_MESSAGES.INVALID_OTP;
//   }

//   //
//   if (code === "OTP_EXPIRED") {
//     return AUTH_ERROR_MESSAGES.OTP_EXPIRED;
//   }

//   // Login credentials
//   if (code === "INVALID_CREDENTIALS") {
//     return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
//   }

//   return AUTH_ERROR_MESSAGES.DEFAULT;
// }





import { AUTH_ERROR_MESSAGES } from "../constants/authErrorMessages";

export function getAuthErrorMessage(err: any): string {
  const code = err?.response?.data?.message;
  const status = err?.response?.status;

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

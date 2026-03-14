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


  CHALLENGE: {
    CREATED: "Challenge created successfully",
    UPDATED: "Challenge updated successfully",
    DELETED: "Challenge deleted successfully",
    STATUS_UPDATED: "Challenge status updated successfully",

    TAGS_ADDED: "Challenge tags added successfully",

    ID_REQUIRED: "Challenge ID is required",
    INVALID_STATUS: "Invalid challenge status",
    INVALID_DATA: "Invalid challenge data",

    FETCHED: "Challenge fetched successfully",
    LANGUAGES_FETCHED: "Challenge languages fetched successfully",
    TEST_CASES_FETCHED: "Challenge test cases fetched successfully",
    HINTS_FETCHED: "Challenge hints fetched successfully",
    NOT_FOUND: "Challenge not found",

    TEMPLATES_FETCHED: "Challenge templates fetched successfully",
    TEMPLATES_NOT_FOUND: "Challenge templates not found",
  },


  SUBMISSION: {
    RUN_SUCCESS: "Code executed successfully",
    SUBMIT_SUCCESS: "Submission evaluated successfully",
  },


  LEVEL: {
    CREATED: "Level created successfully",
    FETCH_SUCCESS: "Levels retrieved successfully",
    UPDATED: "Level updated successfully",
    DELETED: "Level deleted successfully",
    ID_REQUIRED: "Level ID is required",
    NOT_FOUND: "Level not found",
  },


  BADGE: {
    FETCH_SUCCESS: "Badges retrieved successfully",
    CREATE_SUCCESS: "Badge created successfully",
    UPDATE_SUCCESS: "Badge updated successfully",
    DELETE_SUCCESS: "Badge deleted successfully",
    ID_REQUIRED: "Badge id is required",
    ALREADY_EXISTS: "A badge with this name already exists",
  },

  CHAT: {
    GROUPS_FETCH_SUCCESS: "Groups fetched successfully",
    GROUP_STATUS_UPDATED: "Group status updated successfully",
    GROUP_DELETED: "Group deleted successfully",
  },

  NOTIFICATION: {
    SENT: "Notification sent successfully",
    FETCH_SUCCESS: "Notifications fetched successfully",
    MARKED_READ: "Notification marked as read",
    MARKED_ALL_READ: "All notifications marked as read",
    CLEARED: "Notifications cleared",
    ID_REQUIRED: "Notification id is required",
  },


  PLAN: {
    CREATED: "Plan created successfully",
    FETCH_SUCCESS: "Plans fetched successfully",
    UPDATED: "Plan updated successfully",
    DELETED: "Plan deleted successfully",
    ID_REQUIRED: "Plan ID is required",
    NOT_FOUND: "Plan not found",
  },


  COMMON: {
    SUCCESS: "Success",
    FETCH_SUCCESS: "Resource fetched successfully",
    BAD_REQUEST: "Bad request",
    INTERNAL_ERROR: "Something went wrong",
    FORBIDDEN: "You are not allowed to access this resource",
    NOT_FOUND: "Resource not found",
  },
} as const;

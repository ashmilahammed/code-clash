export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    FORGOT_VERIFY_OTP: '/auth/forgot-verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    DASHBOARD: '/dashboard',
    LEADERBOARD: '/leaderboard',
    SOLVE_CHALLENGE: '/challenges/:id',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    MESSAGES: '/messages',
    PREMIUM: '/premium',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_STATS: '/admin/users/:id/stats',
    CHALLENGES: '/admin/challenges',
    LEVELS: '/admin/levels',
    BADGES: '/admin/badges',
    PLANS: '/admin/plans',
    GROUPS: '/admin/groups',
    REPORTS: '/admin/reports',
    NOTIFICATIONS: '/admin/notifications',
    CHALLENGES_CREATE: '/admin/challenges/create',
    CHALLENGES_EDIT: '/admin/challenges/edit/:id',
  },
  ERRORS: {
    FORBIDDEN: '/403',
    NOT_FOUND: '*'
  }
} as const;

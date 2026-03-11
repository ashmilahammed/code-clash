import { IPasswordService } from "../../services/IPasswordService";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "blocked";

export class User {
  constructor(
    public readonly id: string | undefined,

    public username: string,
    public email: string,
    private password: string | null,

    public avatar: string | null,
    public avatarPublicId: string | null,
    public about: string | null,

    public github_url: string | null,
    public linkedin_url: string | null,

    public badge_id: string | null,
    public level_id: string | null,

    private xp: number,

    private current_streak: number,
    private longest_streak: number,
    private last_login_date: Date | null,

    public is_premium: boolean,
    public premium_expiry_date: Date | null,
    public premium_expiry_notification_sent: boolean,
    public date_joined: Date,

    public role: UserRole,
    public status: UserStatus,

    private refreshToken: string | null,

    public isVerified: boolean,
    private otp: string | null,
    private otpExpires: Date | null,
    public banned_until: Date | null = null,
    public ban_reason: string | null = null
  ) {
    this.validate();
  }


  //validation
  private validate() {
    if (!this.username.trim()) {
      throw new Error("Username is required");
    }

    if (!this.email.trim()) {
      throw new Error("Email is required");
    }

    if (this.xp < 0) {
      throw new Error("XP cannot be negative");
    }
  }



  // xp and level
  addXp(amount: number) {
    if (amount <= 0) {
      throw new Error("XP increment must be positive");
    }
    this.xp += amount;
  }

  getXp() {
    return this.xp;
  }

  //streak
  updateLoginStreak(
    current: number,
    longest: number,
    lastLogin: Date
  ) {
    this.current_streak = current;
    this.longest_streak = longest;
    this.last_login_date = lastLogin;
  }

  getStreaks() {
    return {
      current: this.current_streak,
      longest: this.longest_streak,
      lastLoginDate: this.last_login_date,
    };
  }



  // login streak
  recordLogin(at: Date = new Date()) {
    const today = new Date(at);
    today.setUTCHours(0, 0, 0, 0);

    let currentStreak = this.current_streak;
    const longestStreak = this.longest_streak;

    if (this.last_login_date) {
      const lastLogin = new Date(this.last_login_date);
      lastLogin.setUTCHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - lastLogin.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
      // diffDays === 0 → same day, no change
    } else {
      // First ever login
      currentStreak = 1;
    }

    this.current_streak = currentStreak;
    this.longest_streak = Math.max(longestStreak, currentStreak);
    this.last_login_date = at;
  }



  //auth/ security

  hasPassword(): boolean {
    return this.password !== null;
  }

  async verifyPassword(
    plainPassword: string,
    passwordService: IPasswordService
  ): Promise<boolean> {
    if (!this.password) return false;
    return passwordService.compare(plainPassword, this.password);
  }

  setPassword(hashed: string) {
    this.password = hashed;
  }

  setRefreshToken(token: string | null) {
    this.refreshToken = token;
  }


  isRefreshTokenValid(token: string): boolean {
    return this.refreshToken === token;
  }

  verifyAccount() {
    this.isVerified = true;
    this.otp = null;
    this.otpExpires = null;
  }


  isOtpValid(inputOtp: string, now: Date = new Date()): boolean {
    if (!this.otp || !this.otpExpires) return false;
    if (this.otp !== inputOtp) return false;
    if (this.otpExpires < now) return false;
    return true;
  }

  clearOtp() {
    this.otp = null;
    this.otpExpires = null;
  }




  // admin
  block() {
    this.status = "blocked";
  }

  activate() {
    this.status = "active";
  }

  isBanned(): boolean {
    if (!this.banned_until) return false;
    return new Date() < new Date(this.banned_until);
  }

  ban(until: Date, reason: string) {
    this.banned_until = until;
    this.ban_reason = reason;
  }

  unban() {
    this.banned_until = null;
    this.ban_reason = null;
  }




  updateAvatar(url: string, publicId: string) {
    this.avatar = url;
    this.avatarPublicId = publicId;
  }



  // READ MODE (safe exposure)
  snapshot() {
    return {
      id: this.id!,
      username: this.username,
      email: this.email,
      xp: this.xp,
      level_id: this.level_id,

      avatar: this.avatar,
      about: this.about,
      github_url: this.github_url,
      linkedin_url: this.linkedin_url,

      badge_id: this.badge_id,
      current_streak: this.current_streak,
      longest_streak: this.longest_streak,
      is_premium: this.is_premium,
      premium_expiry_date: this.premium_expiry_date,
      premium_expiry_notification_sent: this.premium_expiry_notification_sent,
      role: this.role,
      status: this.status,
      isVerified: this.isVerified,
      banned_until: this.banned_until,
      ban_reason: this.ban_reason,
      isBanned: this.isBanned()
    };
  }
}





import { User } from "./User";

export class UserFactory {

  static createGoogleUser(params: {
    username: string;
    email: string;
  }): User {
    return new User(
      undefined, // id

      params.username,
      params.email,
      null, // password (Google users don't have password)

      `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`, // avatar
      null, // avatarPublicId
      null, // about

      null, // github_url
      null, // linkedin_url

      null, // badge_id
      null, // level_id

      0, // xp

      0, // current_streak
      0, // longest_streak
      null, // last_login_date

      false, // is_premium
      null, // premium_expiry_date
      false, // premium_expiry_notification_sent

      new Date(), // date_joined

      "user", // role
      "active", // status

      null, // refreshToken

      true, // isVerified (Google users are already verified)

      null, // otp
      null, // otpExpires

      null, // banned_until
      null  // ban_reason
    );
  }



  static createEmailUser(params: {
    username: string;
    email: string;
    hashedPassword: string;
    otp: string;
    otpExpires: Date;
  }): User {
    return new User(
      undefined, // id

      params.username,
      params.email,
      params.hashedPassword,

      `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`, // avatar
      null, // avatarPublicId
      null, // about

      null, // github_url
      null, // linkedin_url

      null, // badge_id
      null, // level_id

      0, // xp

      0, // current_streak
      0, // longest_streak
      null, // last_login_date

      false, // is_premium
      null, // premium_expiry_date
      false, // premium_expiry_notification_sent

      new Date(), // date_joined

      "user", // role
      "active", // status

      null, // refreshToken

      false, // isVerified (email users must verify OTP)

      params.otp,
      params.otpExpires,

      null, // banned_until
      null  // ban_reason
    );
  }

}
export interface IUserAuthRepository {
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;

  saveOtp(
    id: string, 
    otp: string | null, 
    otpExpires: Date | null, 
    resetVerifyField?: boolean
  ): Promise<void>;
  
  verifyUser(userId: string): Promise<void>;

  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}

// import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
// import { PasswordService } from "../../../infrastructure/security/passwordService";
// import { generateOtp } from "../../../utils/generateOtp";
// import { EmailService } from "../../../infrastructure/services/emailService";



// const userRepo = new UserRepository();
// const emailService = new EmailService();


// export const registerUseCase = async (
//   username: string,
//   email: string,
//   password: string
// ) => {

//   const existing = await userRepo.findByEmail(email);
//   if (existing) throw new Error("Email already registered");

//   const hashed = await PasswordService.hashPassword(password);

//   const { otp, expires } = generateOtp();

//   // create unverified user
//   const newUser = await userRepo.createUser({
//     username,
//     email,
//     password: hashed,

//     avatar_id: null,
//     badge_id: null,
//     level_id: null,

//     xp: 0,
//     current_streak: 0,
//     longest_streak: 0,

//     is_premium: false,

//     date_joined: new Date(),

//     role: "user",
//     status: "active",

//     refreshToken: null,

//     ///
//     isVerified: false,
//     otp,
//     otpExpires: expires,
//   });

//   // 
//   await emailService.sendOtpEmail(email, otp);

//   console.log(`OTP sent to ${email}: ${otp}`);

//   return {
//     message: "OTP sent to email",
//     userId: newUser.id, // needed for OTP verification
//   };
// };




import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";
import { generateOtp } from "../../../utils/generateOtp";
import { EmailService } from "../../../infrastructure/services/emailService";

const userRepo = new UserRepository();
const emailService = new EmailService();

export const registerUseCase = async (
  username: string,
  email: string,
  password: string
) => {

  // 1️⃣ Check if user already exists
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already registered");

  // 2️⃣ Hash password
  const hashed = await PasswordService.hashPassword(password);

  // 3️⃣ Create user WITHOUT OTP here
  const newUser = await userRepo.createUser({
    username,
    email,
    password: hashed,

    avatar_id: null,
    badge_id: null,
    level_id: null,

    xp: 0,
    current_streak: 0,
    longest_streak: 0,

    is_premium: false,

    date_joined: new Date(),

    role: "user",
    status: "active",

    refreshToken: null,

    // registration-specific
    isVerified: false,
  });

  // 4️⃣ Generate OTP
  const { otp, expires } = generateOtp();

  // 5️⃣ Save OTP (registration → set isVerified = false)
  await userRepo.saveOtp(newUser.id!, otp, expires, true);

  // 6️⃣ Send OTP email
  await emailService.sendOtpEmail(email, otp);

  console.log(`REGISTER OTP for ${email}: ${otp}`);

  return {
    message: "OTP sent to email",
    userId: newUser.id, // required for /verify-otp
  };
};

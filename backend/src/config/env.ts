import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI ?? "",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",

  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES ?? "7d",

  EMAIL_USER: process.env.EMAIL_USER ?? "",
  EMAIL_PASS: process.env.EMAIL_PASS ?? "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
};






// import dotenv from "dotenv";
// dotenv.config();

// export const ENV = {
//   JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
//   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
//   ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
//   REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",
// };


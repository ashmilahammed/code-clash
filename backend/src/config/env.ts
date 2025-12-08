// import dotenv from "dotenv";
// dotenv.config();

// export const ENV = {
//   JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
//   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
//   ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
//   REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",
// };



import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI ?? "",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",

  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES ?? "7d",
};

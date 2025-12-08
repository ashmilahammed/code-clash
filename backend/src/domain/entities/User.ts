export interface User {
  _id: string;     // required (MongoDB ID returned as string)

  username: string;
  email: string;

  password: string;  // required for login

  avatar?: string;

  xp: number;
  level: number;
  streak: number;

  role: "user" | "admin";

  refreshToken?: string | null;
}



// export interface IUser {
//   _id?: string;

//   username: string;
//   email: string;
//   password?: string;

//   avatar_id?: string | null;
//   badge_id?: string | null;
//   level_id?: string | null;

//   xp: number;

//   current_streak: number;
//   longest_streak: number;

//   is_premium: boolean;

//   date_joined: Date;

//   role: "user" | "admin";

//   status: "active" | "blocked";

//   refreshToken?: string | null;
// }

export interface AuthUserDTO {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
}

export interface AuthUserDTO {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  avatar: string | null;
  about: string | null;
  github_url: string | null;
  linkedin_url: string | null;
}

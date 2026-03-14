export interface ListUsersQueryDTO {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "blocked";
}
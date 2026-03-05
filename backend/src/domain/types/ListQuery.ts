export interface ListQuery {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "blocked"; 
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

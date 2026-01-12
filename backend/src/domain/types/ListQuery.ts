// export interface ListQuery {
//   page: number;
//   limit: number;
//   search?: string;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
//   filters?: {
//     status?: "active" | "blocked";
//   };
// }

export interface ListQuery {
  page: number;
  limit: number;
  search?: string;
  status?: "active" | "blocked"; 
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

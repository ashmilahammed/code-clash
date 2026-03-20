import { User } from "../../entities/user/User";
import { ListQuery } from "../../types/ListQuery";
import { PaginatedResult } from "../../types/PaginatedResult";

export interface IUserAdminRepository {
  findAll(query: ListQuery): Promise<PaginatedResult<User>>;
  
  updateStatus(userId: string, status: "active" | "blocked"): Promise<void>;
}

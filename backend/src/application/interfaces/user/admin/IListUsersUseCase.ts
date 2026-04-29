import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { UserResponseDTO } from "../../../dto/user/UserResponseDTO";

export interface IListUsersUseCase {
  execute(query: ListQuery): Promise<PaginatedResult<UserResponseDTO>>;
}

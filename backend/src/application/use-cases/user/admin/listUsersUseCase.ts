import { IUserAdminRepository } from "../../../../domain/repositories/user/IUserAdminRepository";
import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { UserResponseDTO } from "../../../dto/user/UserResponseDTO";
import { UserDTOMapper } from "../../../mappers/UserDTOMapper";

import { IListUsersUseCase } from "../../../interfaces/user/admin/IListUsersUseCase";

export class ListUsersUseCase implements IListUsersUseCase {
  constructor(
    private readonly _userRepo: IUserAdminRepository
  ) {}

  async execute(
    query: ListQuery
  ): Promise<PaginatedResult<UserResponseDTO>> {

    const result = await this._userRepo.findAll(query);

    return {
      ...result,
      // data: result.data.map(UserDTOMapper.toResponse),
      data: result.data.map(user =>
        UserDTOMapper.toResponse(user)
      ),
    };
  }
}






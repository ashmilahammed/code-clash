import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { UserResponseDTO } from "../../../dto/user/UserResponseDTO";
import { UserMapper } from "../../../mappers/UserMapper";



export class ListUsersUseCase {
  constructor(
    private readonly _userRepo: IUserRepository
  ) {}

  async execute(
    query: ListQuery
  ): Promise<PaginatedResult<UserResponseDTO>> {

    const result = await this._userRepo.findAll(query);

    return {
      ...result,
      data: result.data.map(UserMapper.toResponse),
    };
  }
}







// import { IUserRepository } from "../../../domain/repositories/IUserRepository";


// export class ListUsersUseCase {
//     constructor(private userRepo: IUserRepository) { }

//     async execute(
//         page: number,
//         limit: number,
//         status?: "active" | "blocked"
//     ) {
//         const filter = status ? { status } : undefined;

//         return this.userRepo.findAll(page, limit, filter);
//     }
// }



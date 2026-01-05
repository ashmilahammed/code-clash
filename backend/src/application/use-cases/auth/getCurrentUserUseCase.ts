import { IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetCurrentUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<IUser> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user; // DOMAIN entity
  }
}



// import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// import { AuthUserDTO } from "../../dto/AuthUserDTO";


// export class GetCurrentUserUseCase {
//   constructor(private userRepository: IUserRepository) {}

//   async execute(userId: string): Promise<AuthUserDTO> {
//     const user = await this.userRepository.findById(userId);

//     if (!user) {
//       throw new Error("USER_NOT_FOUND");
//     }

//     return {
//       id: user.id!,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified,
//     };
//   }
// }

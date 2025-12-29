import { UserRepository } from "../repositories/UserRepository";

import { ListUsersUseCase } from "../../application/use-cases/admin/listUsersUseCase";
import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/updateUserStatusUseCase";


// repository
const userRepository = new UserRepository();

// use cases
export const listUsersUseCase =
  new ListUsersUseCase(userRepository);

export const updateUserStatusUseCase =
  new UpdateUserStatusUseCase(userRepository);

// import { IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";



export class ListUsersUseCase {
    constructor(private userRepo: IUserRepository) { }

    async execute(
        page: number,
        limit: number,
        status?: "active" | "blocked"
    ) {
        const filter = status ? { status } : undefined;

        return this.userRepo.findAll(page, limit, filter);
    }
}



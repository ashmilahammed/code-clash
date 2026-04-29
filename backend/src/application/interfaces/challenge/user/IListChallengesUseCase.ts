import { ListQuery } from "../../../../domain/types/ListQuery";
import { PaginatedResult } from "../../../../domain/types/PaginatedResult";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";

export interface IListChallengesUseCase {
  execute(query: ListQuery): Promise<PaginatedResult<Challenge>>;
}

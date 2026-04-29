import { Level } from "../../../../domain/entities/level/Level";
import { CreateLevelDTO } from "../../../dto/level/CreateLevelDTO";

export interface ICreateLevelUseCase {
  execute(dto: CreateLevelDTO): Promise<Level>;
}

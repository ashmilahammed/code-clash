import { Level } from "../../../../domain/entities/level/Level";
import { UpdateLevelDTO } from "../../../dto/level/UpdateLevelDTO";

export interface IUpdateLevelUseCase {
  execute(id: string, dto: UpdateLevelDTO): Promise<Level>;
}

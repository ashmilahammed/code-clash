import { Badge } from "../../../domain/entities/badge/Badge";
import { UpdateBadgeDTO } from "../../dto/badge/UpdateBadgeDTO";

export interface IUpdateBadgeUseCase {
  execute(id: string, dto: UpdateBadgeDTO): Promise<Badge>;
}

import { Badge } from "../../../domain/entities/badge/Badge";
import { CreateBadgeDTO } from "../../dto/badge/CreateBadgeDTO";

export interface ICreateBadgeUseCase {
  execute(dto: CreateBadgeDTO): Promise<Badge>;
}

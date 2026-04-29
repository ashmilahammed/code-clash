import { Badge } from "../../../domain/entities/badge/Badge";

export interface IGetBadgesUseCase {
  execute(page?: number, limit?: number, search?: string): Promise<{ badges: Badge[], total: number, totalPages: number }>;
}

import { Badge } from "../../entities/badge/Badge";

export interface IBadgeRepository {
    findAll(): Promise<Badge[]>;
    findById(id: string): Promise<Badge | null>;
    create(badge: Badge): Promise<Badge>;
}

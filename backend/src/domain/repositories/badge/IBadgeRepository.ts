import { Badge } from "../../entities/badge/Badge";

export interface IBadgeRepository {
    findAll(): Promise<Badge[]>;
    findById(id: string): Promise<Badge | null>;
    create(badge: Badge): Promise<Badge>;
    updateEntity(badge: Badge): Promise<Badge>;
    delete(id: string): Promise<boolean>;
    findByRequirementType(type: string): Promise<Badge[]>;
    findByIds(ids: string[]): Promise<Badge[]>;
}

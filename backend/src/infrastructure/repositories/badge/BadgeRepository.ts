import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";
import { BadgeModel, IBadgeDoc } from "../../database/models/badge/BadgeModel";

export class BadgeRepository implements IBadgeRepository {

    async findAll(): Promise<Badge[]> {
        const docs = await BadgeModel.find().sort({ minXpRequired: 1 });
        return docs.map(this.toEntity);
    }

    async findById(id: string): Promise<Badge | null> {
        const doc = await BadgeModel.findById(id);
        return doc ? this.toEntity(doc) : null;
    }

    async create(badge: Badge): Promise<Badge> {
        const doc = await BadgeModel.create({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            minXpRequired: badge.minXpRequired
        });
        return this.toEntity(doc);
    }

    private toEntity(doc: IBadgeDoc): Badge {
        return new Badge(
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.icon,
            doc.minXpRequired,
            doc.createdAt,
            doc.updatedAt
        );
    }
}

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
            minXpRequired: badge.minXpRequired,
            category: badge.category,
            requirementType: badge.requirementType,
            requirementValue: badge.requirementValue,
            isActive: badge.isActive
        });
        return this.toEntity(doc);
    }

    async update(id: string, badge: Partial<Badge>): Promise<Badge | null> {
        const doc = await BadgeModel.findByIdAndUpdate(id, badge, { new: true });
        return doc ? this.toEntity(doc) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await BadgeModel.findByIdAndDelete(id);
        return !!result;
    }

    private toEntity(doc: IBadgeDoc): Badge {
        return new Badge(
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.icon,
            doc.minXpRequired,
            doc.category,
            doc.requirementType,
            doc.requirementValue,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }
}

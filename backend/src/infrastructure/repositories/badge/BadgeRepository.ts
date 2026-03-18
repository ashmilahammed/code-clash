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


    async updateEntity(badge: Badge): Promise<Badge> {

        const doc = await BadgeModel.findByIdAndUpdate(
            badge.id,
            {
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                minXpRequired: badge.minXpRequired,
                category: badge.category,
                requirementType: badge.requirementType,
                requirementValue: badge.requirementValue,
                isActive: badge.isActive,
                updatedAt: badge.updatedAt ?? new Date()
            },
            { new: true }
        );

        if (!doc) {
            throw new Error("BADGE_NOT_FOUND");
        }

        return this.toEntity(doc);
    }

    async delete(id: string): Promise<boolean> {
        const result = await BadgeModel.findByIdAndDelete(id);
        return !!result;
    }

    async findByRequirementType(type: string): Promise<Badge[]> {
        const docs = await BadgeModel.find({ requirementType: type, isActive: true });
        return docs.map(this.toEntity);
    }

    async findByIds(ids: string[]): Promise<Badge[]> {
        const docs = await BadgeModel.find({ _id: { $in: ids } });
        return docs.map(this.toEntity);
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

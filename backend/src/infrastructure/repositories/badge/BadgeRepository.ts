import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";
import { BadgeModel, IBadgeDoc } from "../../database/models/badge/BadgeModel";
import { BaseRepository } from "../BaseRepository";


export class BadgeRepository
  extends BaseRepository<IBadgeDoc>
  implements IBadgeRepository {

  constructor() {
    super(BadgeModel);
  }

  async findAll(): Promise<Badge[]> {
    const docs = await this._model
      .find()
      .sort({ minXpRequired: 1 })
      .exec();

    return docs.map(doc => this.toEntity(doc));
  }

  async findAllPaginated(skip: number, limit: number, query: string = ""): Promise<{ badges: Badge[], total: number }> {
    const filter: Record<string, unknown> = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ];
    }

    const [docs, total] = await Promise.all([
      this.findManyRaw(filter, skip, limit, { _id: -1 }), // Sort by ID descending as it was in frontend
      this.count(filter)
    ]);

    return {
      badges: docs.map(doc => this.toEntity(doc)),
      total
    };
  }

  async findById(id: string): Promise<Badge | null> {
    const doc = await this.findByIdRaw(id);
    return doc ? this.toEntity(doc) : null;
  }

  async create(badge: Badge): Promise<Badge> {
    const doc = await this.createRaw({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      minXpRequired: badge.minXpRequired,
      category: badge.category,
      requirementType: badge.requirementType,
      requirementValue: badge.requirementValue,
      isActive: badge.isActive
    } as Partial<IBadgeDoc>);

    return this.toEntity(doc);
  }

  async updateEntity(badge: Badge): Promise<Badge> {
    const updated = await this.updateRaw(
      badge.id!,
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
      } as Partial<IBadgeDoc>
    );

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.deleteByIdRaw(id);
    return true;
  }

  async findByRequirementType(type: string): Promise<Badge[]> {
    const docs = await this._model.find({
      requirementType: type,
      isActive: true
    }).exec();

    return docs.map(doc => this.toEntity(doc));
  }

  async findByIds(ids: string[]): Promise<Badge[]> {
    const docs = await this._model.find({
      _id: { $in: ids }
    }).exec();

    return docs.map(doc => this.toEntity(doc));
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
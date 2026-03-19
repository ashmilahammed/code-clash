import { IPlanRepository } from "../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../domain/entities/plan/Plan";
import { PlanModel, IPlanDoc } from "../../database/models/plan/PlanModel";
import { PlanMapper } from "../../../application/mappers/PlanMapper";
import { BaseRepository } from "../BaseRepository";


export class PlanRepository
  extends BaseRepository<IPlanDoc>
  implements IPlanRepository {

  constructor() {
    super(PlanModel);
  }

  async create(plan: Plan): Promise<Plan> {
    const persistenceData = PlanMapper.toPersistence(plan);
    const created = await this.createRaw(persistenceData);
    return PlanMapper.toDomain(created);
  }

  async findById(id: string): Promise<Plan | null> {
    const doc = await this.findByIdRaw(id);
    return doc ? PlanMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<Plan[]> {
    const docs = await this._model
      .find()
      .sort({ createdAt: -1 })
      .exec();

    return docs.map(PlanMapper.toDomain);
  }

  async update(id: string, planData: Partial<Plan>): Promise<Plan | null> {
    const updateData: any = {};

    if (planData.name !== undefined) updateData.name = planData.name;
    if (planData.description !== undefined) updateData.description = planData.description;
    if (planData.price !== undefined) updateData.price = planData.price;
    if (planData.duration !== undefined) updateData.duration = planData.duration;
    if (planData.features !== undefined) updateData.features = planData.features;
    if (planData.status !== undefined) updateData.status = planData.status;

    const updated = await this.updateRaw(id, updateData);
    return updated ? PlanMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.deleteByIdRaw(id);
  }
}
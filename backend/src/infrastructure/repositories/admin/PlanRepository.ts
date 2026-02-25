import { IPlanRepository } from "../../../domain/repositories/admin/IPlanRepository";
import { Plan } from "../../../domain/entities/admin/Plan";
import { PlanModel } from "../../database/models/admin/PlanModel";
import { Types } from "mongoose";
import { PlanMapper } from "../../../application/mappers/admin/PlanMapper";

export class PlanRepository implements IPlanRepository {
    async create(plan: Plan): Promise<Plan> {
        const persistenceData = PlanMapper.toPersistence(plan);
        const createdModel = await PlanModel.create(persistenceData);
        return PlanMapper.toDomain(createdModel);
    }

    async findById(id: string): Promise<Plan | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const doc = await PlanModel.findById(id);
        return doc ? PlanMapper.toDomain(doc) : null;
    }

    async findAll(): Promise<Plan[]> {
        const docs = await PlanModel.find().sort({ createdAt: -1 });
        return docs.map(PlanMapper.toDomain);
    }

    async update(id: string, planData: Partial<Plan>): Promise<Plan | null> {
        if (!Types.ObjectId.isValid(id)) return null;

        const updateData: any = {};
        if (planData.name !== undefined) updateData.name = planData.name;
        if (planData.description !== undefined) updateData.description = planData.description;
        if (planData.price !== undefined) updateData.price = planData.price;
        if (planData.duration !== undefined) updateData.duration = planData.duration;
        if (planData.features !== undefined) updateData.features = planData.features;
        if (planData.status !== undefined) updateData.status = planData.status;

        const updatedDoc = await PlanModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true } // Return the updated document
        );

        return updatedDoc ? PlanMapper.toDomain(updatedDoc) : null;
    }

    async delete(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) return;
        await PlanModel.findByIdAndDelete(id);
    }
}

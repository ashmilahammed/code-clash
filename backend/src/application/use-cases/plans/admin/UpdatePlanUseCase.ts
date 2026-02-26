import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";

export class UpdatePlanUseCase {
    constructor(private planRepository: IPlanRepository) { }

    async execute(id: string, updateData: Partial<Plan>): Promise<Plan> {
        const updatedPlan = await this.planRepository.update(id, updateData);
        if (!updatedPlan) {
            throw new Error("Plan not found");
        }
        return updatedPlan;
    }
}

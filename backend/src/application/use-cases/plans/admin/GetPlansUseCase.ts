import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";

export class GetPlansUseCase {
    constructor(private planRepository: IPlanRepository) { }

    async execute(): Promise<Plan[]> {
        return this.planRepository.findAll();
    }
}

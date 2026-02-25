import { IPlanRepository } from "../../../../domain/repositories/admin/IPlanRepository";
import { Plan } from "../../../../domain/entities/admin/Plan";

export class GetPlansUseCase {
    constructor(private planRepository: IPlanRepository) { }

    async execute(): Promise<Plan[]> {
        return this.planRepository.findAll();
    }
}

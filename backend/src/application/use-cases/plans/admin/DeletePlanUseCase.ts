import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";

export class DeletePlanUseCase {
    constructor(private planRepository: IPlanRepository) { }

    async execute(id: string): Promise<void> {
        await this.planRepository.delete(id);
    }
}

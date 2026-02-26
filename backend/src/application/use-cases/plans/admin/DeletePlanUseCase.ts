import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";

export class DeletePlanUseCase {
    constructor(private planRepository: IPlanRepository) { }

    async execute(id: string): Promise<void> {
        // Technically this does a hard delete, you could choose to just toggle status to Inactive instead if requested
        await this.planRepository.delete(id);
    }
}

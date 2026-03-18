import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";

export class DeletePlanUseCase {
    constructor(
        private readonly _planRepository: IPlanRepository
    ) { }

    async execute(id: string): Promise<void> {
        await this._planRepository.delete(id);
    }
}

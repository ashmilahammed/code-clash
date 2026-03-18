import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";

export class GetPlansUseCase {
    constructor(
        private readonly _planRepository: IPlanRepository
    ) { }

    async execute(): Promise<Plan[]> {
        return this._planRepository.findAll();
    }
}

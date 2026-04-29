import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";

import { IGetPlansUseCase } from "../../../interfaces/plans/admin/IGetPlansUseCase";

export class GetPlansUseCase implements IGetPlansUseCase {
    constructor(
        private readonly _planRepository: IPlanRepository
    ) { }

    async execute(): Promise<Plan[]> {
        return this._planRepository.findAll();
    }
}

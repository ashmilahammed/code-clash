import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";
import { CreatePlanDTO } from "../../../dto/plan/CreatePlanDTO";
import { ICreatePlanUseCase } from "../../../interfaces/plans/admin/ICreatePlanUseCase";

export class CreatePlanUseCase implements ICreatePlanUseCase {
    constructor(
        private readonly _planRepository: IPlanRepository
    ) { }

    async execute(dto: CreatePlanDTO): Promise<Plan> {
 
        const plan = new Plan(
            undefined,
            dto.name,
            dto.description,
            dto.price,
            dto.duration,
            dto.features,
            dto.status || 'Active'
        );

        return this._planRepository.create(plan);
    }
}

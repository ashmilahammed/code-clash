import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";
import { CreatePlanDTO } from "../../../dto/plan/CreatePlanDTO";


export class CreatePlanUseCase {
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

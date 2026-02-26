import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { Plan } from "../../../../domain/entities/plan/Plan";

interface CreatePlanDto {
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    status?: 'Active' | 'Inactive';
}

export class CreatePlanUseCase {
    constructor(private planRepository: IPlanRepository) { }

    async execute(dto: CreatePlanDto): Promise<Plan> {
        // Validation handled by the Plan entity constructor
        const plan = new Plan(
            undefined,
            dto.name,
            dto.description,
            dto.price,
            dto.duration,
            dto.features,
            dto.status || 'Active'
        );

        return this.planRepository.create(plan);
    }
}

import { Plan } from "../../../domain/entities/admin/Plan";

export interface IPlanRepository {
    create(plan: Plan): Promise<Plan>;
    findById(id: string): Promise<Plan | null>;
    findAll(): Promise<Plan[]>;
    update(id: string, planData: Partial<Plan>): Promise<Plan | null>;
    delete(id: string): Promise<void>;
}

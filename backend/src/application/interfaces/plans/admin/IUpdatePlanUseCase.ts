import { Plan } from "../../../../domain/entities/plan/Plan";

export interface IUpdatePlanUseCase {
  execute(id: string, updateData: Partial<Plan>): Promise<Plan>;
}

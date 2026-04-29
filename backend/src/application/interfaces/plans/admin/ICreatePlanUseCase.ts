import { Plan } from "../../../../domain/entities/plan/Plan";
import { CreatePlanDTO } from "../../../dto/plan/CreatePlanDTO";

export interface ICreatePlanUseCase {
  execute(dto: CreatePlanDTO): Promise<Plan>;
}

import { Plan } from "../../../../domain/entities/plan/Plan";

export interface IGetPlansUseCase {
  execute(): Promise<Plan[]>;
}

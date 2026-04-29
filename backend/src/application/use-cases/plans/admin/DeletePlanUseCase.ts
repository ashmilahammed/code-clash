import { IPlanRepository } from "../../../../domain/repositories/plan/IPlanRepository";
import { IDeletePlanUseCase } from "../../../interfaces/plans/admin/IDeletePlanUseCase";


export class DeletePlanUseCase implements IDeletePlanUseCase {
    constructor(
        private readonly _planRepository: IPlanRepository
    ) { }

    async execute(id: string): Promise<void> {
        await this._planRepository.delete(id);
    }
}

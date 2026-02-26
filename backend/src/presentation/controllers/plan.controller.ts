import { Request, Response } from "express";
import { CreatePlanUseCase } from "../../application/use-cases/plans/admin/CreatePlanUseCase";
import { GetPlansUseCase } from "../../application/use-cases/plans/admin/GetPlansUseCase";
import { UpdatePlanUseCase } from "../../application/use-cases/plans/admin/UpdatePlanUseCase";
import { DeletePlanUseCase } from "../../application/use-cases/plans/admin/DeletePlanUseCase";
import { WinstonLogger } from "../../infrastructure/services/logger";

export class PlanController {
    constructor(
        private createPlanUseCase: CreatePlanUseCase,
        private getPlansUseCase: GetPlansUseCase,
        private updatePlanUseCase: UpdatePlanUseCase,
        private deletePlanUseCase: DeletePlanUseCase,
        private logger: WinstonLogger
    ) { }

    async createPlan(req: Request, res: Response) {
        try {
            const { name, description, price, duration, features, status } = req.body;
            const newPlan = await this.createPlanUseCase.execute({
                name,
                description,
                price,
                duration,
                features,
                status
            });
            return res.status(201).json(newPlan);
        } catch (error: any) {
            this.logger.error("Error creating plan", error);
            return res.status(400).json({ message: error.message || "Failed to create plan" });
        }
    }

    async getPlans(req: Request, res: Response) {
        try {
            const plans = await this.getPlansUseCase.execute();
            return res.status(200).json(plans);
        } catch (error: any) {
            this.logger.error("Error fetching plans", error);
            return res.status(500).json({ message: "Failed to fetch plans" });
        }
    }

    async getPublicPlans(req: Request, res: Response) {
        try {
            const plans = await this.getPlansUseCase.execute();
            const activePlans = plans.filter(p => p.status === 'Active');
            return res.status(200).json(activePlans);
        } catch (error: any) {
            this.logger.error("Error fetching public plans", error);
            return res.status(500).json({ message: "Failed to fetch plans" });
        }
    }

    async updatePlan(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Plan ID is required" });
            }

            const updateData = req.body;
            const updatedPlan = await this.updatePlanUseCase.execute(id, updateData);
            return res.status(200).json(updatedPlan);
        } catch (error: any) {
            this.logger.error(`Error updating plan ${req.params.id}`, error);
            return res.status(400).json({ message: error.message || "Failed to update plan" });
        }
    }

    async deletePlan(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Plan ID is required" });
            }

            await this.deletePlanUseCase.execute(id);
            return res.status(204).send();
        } catch (error: any) {
            this.logger.error(`Error deleting plan ${req.params.id}`, error);
            return res.status(500).json({ message: "Failed to delete plan" });
        }
    }
}

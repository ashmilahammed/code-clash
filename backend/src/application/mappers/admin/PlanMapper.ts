import { Plan } from "../../../domain/entities/admin/Plan";
import { IPlanDoc } from "../../../infrastructure/database/models/admin/PlanModel";

export class PlanMapper {
    static toDomain(doc: IPlanDoc): Plan {
        return new Plan(
            doc._id.toString(),
            doc.name,
            doc.description || "No description",
            doc.price,
            doc.duration,
            doc.features,
            doc.status,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(plan: Plan) {
        return {
            name: plan.name,
            description: plan.description,
            price: plan.price,
            duration: plan.duration,
            features: plan.features,
            status: plan.status
        };
    }
}

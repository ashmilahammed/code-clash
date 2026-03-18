import { IPlanRepository } from "../../../domain/repositories/plan/IPlanRepository";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";
import { CreateOrderDTO } from "../../dto/transaction/CreateOrderDTO";



export class CreateRazorpayOrderUseCase {
    constructor(
        private readonly _planRepository: IPlanRepository,
        private readonly _razorpayService: IRazorpayService
    ) { }

    async execute(dto: CreateOrderDTO): Promise<any> {

        const plan = await this._planRepository.findById(dto.planId);

        if (!plan) {
            throw new Error("Plan not found");
        }

        console.log("PLAN STATUS:", plan.status);

        if (plan.status !== "Active") {
            throw new Error("Cannot subscribe to an inactive plan");
        }

        // 
        const amountInPaise = Math.round(plan.price * 100);

        // Receipt id 
        const receiptId = `rcpt_${Date.now()}`;

        const order = await this._razorpayService.createOrder(amountInPaise, "INR", receiptId);

        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        };
    }
}

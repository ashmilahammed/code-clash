import { IPlanRepository } from "../../../domain/repositories/plan/IPlanRepository";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";

interface CreateOrderDTO {
    planId: string;
    userId: string;
}

export class CreateRazorpayOrderUseCase {
    constructor(
        private planRepository: IPlanRepository,
        private razorpayService: IRazorpayService
    ) { }

    async execute(dto: CreateOrderDTO): Promise<any> {
        const plan = await this.planRepository.findById(dto.planId);

        if (!plan) {
            throw new Error("Plan not found");
        }

        console.log("PLAN STATUS:", plan.status);

        if (plan.status !== "Active") {
            throw new Error("Cannot subscribe to an inactive plan");
        }

        // Razorpay requires amount in subunits (e.g. paise for INR)
        // Ensure price is parsed as a number. In plan pricing we might have integers or decimals.
        // Assuming price is in INR (base unit).
        const amountInPaise = Math.round(plan.price * 100);

        // Receipt id can be anything unique. Using combination of userId and timestamp.
        const receiptId = `rcpt_${Date.now()}`;
        // const receiptId = `receipt_${dto.userId}_${Date.now()}`;

        const order = await this.razorpayService.createOrder(amountInPaise, "INR", receiptId);

        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        };
    }
}

import Razorpay from "razorpay";
import crypto from "crypto";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";

export class RazorpayService implements IRazorpayService {
    private razorpay: any;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "mock_key_id",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_key_secret",
        });
    }

    async createOrder(amountInPaise: number, currency: string = "INR", receiptId: string): Promise<any> {
        const options = {
            amount: amountInPaise,
            currency,
            receipt: receiptId,
        };
        return await this.razorpay.orders.create(options);
    }

    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
        const secret = process.env.RAZORPAY_KEY_SECRET || "mock_key_secret";
        const hmac = crypto.createHmac("sha256", secret);

        hmac.update(`${orderId}|${paymentId}`);
        const generatedSignature = hmac.digest("hex");

        return generatedSignature === signature;
    }
}

import Razorpay from "razorpay";
import crypto from "crypto";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";

export class RazorpayService implements IRazorpayService {

    private readonly razorpay: Razorpay;
    private readonly secret: string;

    constructor() {
        const keyId = process.env.RAZORPAY_KEY_ID || "mock_key_id";
        const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_key_secret";

        this.secret = keySecret;

        this.razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    async createOrder(amountInPaise: number, currency: string = "INR", receiptId: string) {

        if (amountInPaise <= 0) {
            throw new Error("Invalid payment amount");
        }

        return this.razorpay.orders.create({
            amount: amountInPaise,
            currency,
            receipt: receiptId,
        });
    }

    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
        
        const hmac = crypto.createHmac("sha256", this.secret);

        hmac.update(`${orderId}|${paymentId}`);
        const generatedSignature = hmac.digest("hex");

        return generatedSignature === signature;
    }
}

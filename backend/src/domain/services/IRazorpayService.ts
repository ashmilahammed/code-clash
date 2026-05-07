export interface IRazorpayService {
    createOrder(amountInPaise: number, currency: string, receiptId: string): Promise<unknown>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
}

export interface IRazorpayService {
    createOrder(amountInPaise: number, currency: string, receiptId: string): Promise<any>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
}

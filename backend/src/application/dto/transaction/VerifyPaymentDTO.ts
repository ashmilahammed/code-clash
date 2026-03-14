export interface VerifyPaymentDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  planId: string;
  userId: string;
}
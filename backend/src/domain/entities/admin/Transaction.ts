export class Transaction {
    constructor(
        public readonly id: string | undefined,
        public readonly userId: string,
        public readonly planId: string,
        public readonly amount: number,
        public readonly paymentMethod: string,
        public readonly status: 'Completed' | 'Pending' | 'Failed',
        public readonly date?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.userId) throw new Error("User ID is required");
        if (!this.planId) throw new Error("Plan ID is required");
        if (this.amount === undefined || this.amount < 0) throw new Error("Valid amount is required");
        if (!this.paymentMethod) throw new Error("Payment method is required");
        if (!['Completed', 'Pending', 'Failed'].includes(this.status)) {
            throw new Error("Invalid transaction status");
        }
    }
}

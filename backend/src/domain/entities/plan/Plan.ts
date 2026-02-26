export class Plan {
    constructor(
        public readonly id: string | undefined,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly duration: number,
        public readonly features: string[],
        public readonly status: 'Active' | 'Inactive',
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name || this.name.trim() === '') {
            throw new Error("Plan name is required");
        }
        if (!this.description || this.description.trim() === '') {
            throw new Error("Plan description is required");
        }
        if (this.price === undefined || this.price < 0) {
            throw new Error("Plan price must be a positive number or zero");
        }
        if (this.duration === undefined || this.duration <= 0) {
            throw new Error("Plan duration must be greater than zero");
        }
        if (!this.features || this.features.length === 0) {
            throw new Error("Plan must have at least one feature");
        }
        if (this.status !== 'Active' && this.status !== 'Inactive') {
            throw new Error("Plan status must be 'Active' or 'Inactive'");
        }
    }
}

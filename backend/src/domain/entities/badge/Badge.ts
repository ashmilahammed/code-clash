export class Badge {
    constructor(
        public readonly id: string | undefined,
        public readonly name: string,
        public readonly description: string,
        public readonly icon: string,
        public readonly minXpRequired: number,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    private validate() {
        if (!this.name) {
            throw new Error("Badge name is required");
        }
        if (!this.icon) {
            throw new Error("Badge icon is required");
        }
    }
}

export class Badge {
    static readonly CATEGORIES = {
        LEVEL: "LEVEL",
        CHALLENGE: "CHALLENGE",
        STREAK: "STREAK",
        PREMIUM: "PREMIUM",
        COMMUNITY: "COMMUNITY",
        SPECIAL: "SPECIAL"
    };

    static readonly REQUIREMENT_TYPES = {
        MANUAL: "manual",
        LEVEL_REACHED: "level_reached",
        CHALLENGE_COMPLETED: "challenge_completed",
        STREAK_ACHIEVED: "streak_achieved",
        PREMIUM_UPGRADED: "premium_upgraded",
        GROUP_JOINED: "group_joined"
    };

    constructor(
        public readonly id: string | undefined,
        public readonly name: string,
        public readonly description: string,
        public readonly icon: string,
        public readonly minXpRequired: number,
        public readonly category: string,
        public readonly requirementType: string,
        public readonly requirementValue: number,
        public readonly isActive: boolean,
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

export type ConversationType = 'direct' | 'group';

export class Conversation {
    constructor(
        public readonly id: string | undefined,
        public readonly type: ConversationType,
        public readonly participants: string[],
        public readonly adminId?: string | null, // for groups
        public readonly name?: string | null, // for groups
        public readonly lastMessageAt?: Date | null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validate();
    }

    // private validate() {
    //     if (!this.participants || this.participants.length < 2) {
    //         throw new Error("A conversation must have at least 2 participants");
    //     }

    //     if (this.type === 'group' && !this.name) {
    //         throw new Error("Group conversations must have a name");
    //     }
    // }


    private validate() {
        if (!this.participants || this.participants.length === 0) {
            throw new Error("A conversation must have at least 1 participant");
        }

        if (this.type === 'direct' && this.participants.length !== 2) {
            throw new Error("Direct conversations must have exactly 2 participants");
        }

        if (this.type === 'group') {
            if (!this.name) {
                throw new Error("Group conversations must have a name");
            }

            if (!this.adminId) {
                throw new Error("Group conversations must have an admin");
            }
        }
    }

}

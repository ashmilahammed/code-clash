export class Message {
    constructor(
        public readonly id: string | undefined,
        public readonly conversationId: string,
        public readonly senderId: string,
        public readonly content: string,
        public readonly readBy: string[], // Array of user IDs who have read the message
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly sender?: { _id: string; username: string; profilePic?: string; }
    ) {
        this.validate();
    }

    private validate() {
        if (!this.conversationId) {
            throw new Error("Message must belong to a conversation");
        }
        if (!this.senderId) {
            throw new Error("Message must have a sender");
        }
        if (!this.content || this.content.trim().length === 0) {
            throw new Error("Message content cannot be empty");
        }
    }
}

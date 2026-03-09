export type ReportReason = 'Spam' | 'Abuse' | 'Harassment' | 'Inappropriate' | 'Other';
export type ReportStatus = 'pending' | 'dismissed' | 'resolved';

export interface UserBasicInfo {
    id: string;
    username: string;
}

export class Report {
    constructor(
        public readonly id: string | undefined,
        public readonly reportedUserId: string | UserBasicInfo,
        public readonly reportedById: string | UserBasicInfo,
        public readonly messageId: string,
        public readonly conversationId: string,
        public readonly reason: ReportReason,
        public status: ReportStatus = 'pending',
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}
}

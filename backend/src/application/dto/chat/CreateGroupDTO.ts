export interface CreateGroupDTO {
  adminId: string;
  name: string;
  description?: string;
  memberLimit?: number;
  isPrivate?: boolean;
  participants: string[];
}
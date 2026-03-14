export interface UpdateBadgeDTO {
  name?: string;
  description?: string;
  icon?: string;
  minXpRequired?: number;
  category?: string;
  requirementType?: string;
  requirementValue?: number;
  isActive?: boolean;
}
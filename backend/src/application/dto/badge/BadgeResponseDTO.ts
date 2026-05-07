export interface BadgeResponseDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  minXpRequired: number;
  category: string;
  requirementType: string;
  requirementValue: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

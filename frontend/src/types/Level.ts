export interface Badge {
    id: string; // 
    _id?: string;
    name: string;
    description: string;
    icon: string;
    minXpRequired: number;
    category: string;
    requirementType: string;
    requirementValue: number;
    isActive: boolean;
}

export interface Level {
    id: string;
    levelNumber: number;
    minXp: number;
    maxXp: number;
    title?: string;
    badgeId?: string; 
    // badge?: Badge; // Optional 
}

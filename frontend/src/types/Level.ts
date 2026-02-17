export interface Badge {
    id: string; // The backend returns _id as id usually if mapped, but here it's likely _id. Let's assume standard
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
    badgeId?: string; // We decided to send ID only
    // badge?: Badge; // Optional if populated later
}

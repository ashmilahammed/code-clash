export interface CreatePlanDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  status: "Active" | "Inactive";
}
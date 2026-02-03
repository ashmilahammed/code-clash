import { ListQuery } from "./ListQuery";

export interface ChallengeListQuery extends ListQuery {
  filters?: {
    isActive?: boolean;
  };
}

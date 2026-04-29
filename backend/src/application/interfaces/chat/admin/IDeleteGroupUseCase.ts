export interface IDeleteGroupUseCase {
  execute(groupId: string): Promise<void>;
}

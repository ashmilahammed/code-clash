export interface IDeleteBadgeUseCase {
  execute(id: string): Promise<boolean>;
}

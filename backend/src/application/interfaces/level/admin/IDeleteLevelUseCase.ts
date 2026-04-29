export interface IDeleteLevelUseCase {
  execute(id: string): Promise<boolean>;
}

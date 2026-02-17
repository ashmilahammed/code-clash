import { Request, Response } from "express";
import { CreateLevelUseCase } from "../../application/use-cases/level/admin/CreateLevelUseCase";
import { GetLevelsUseCase } from "../../application/use-cases/level/GetLevelsUseCase";
import { UpdateLevelUseCase } from "../../application/use-cases/level/admin/UpdateLevelUseCase";
import { DeleteLevelUseCase } from "../../application/use-cases/level/admin/DeleteLevelUseCase";
import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


export class LevelController {
  constructor(
    private readonly _createLevel: CreateLevelUseCase,
    private readonly _getLevels: GetLevelsUseCase,
    private readonly _updateLevel: UpdateLevelUseCase,
    private readonly _deleteLevel: DeleteLevelUseCase
  ) { }

  getAll = async (req: Request, res: Response) => {
    try {
      const levels = await this._getLevels.execute();
      return res.status(HttpStatus.OK).json(ApiResponse.success("Levels retrieved successfully", levels));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { levelNumber, minXp, maxXp, title, badgeId } = req.body;

      const level = await this._createLevel.execute({
        levelNumber,
        minXp,
        maxXp,
        title,
        badgeId
      });

      return res
        .status(HttpStatus.CREATED)
        .json(
          ApiResponse.success(
            MESSAGES.LEVEL.CREATED,
            level
          )
        );

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : MESSAGES.COMMON.BAD_REQUEST;

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(message));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error("Level ID is required"));
      }
      const { levelNumber, minXp, maxXp, title, badgeId } = req.body;
      const updatedLevel = await this._updateLevel.execute(id, { levelNumber, minXp, maxXp, title, badgeId });
      if (!updatedLevel) {
        return res.status(HttpStatus.NOT_FOUND).json(ApiResponse.error("Level not found"));
      }
      return res.status(HttpStatus.OK).json(ApiResponse.success("Level updated successfully", updatedLevel));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST;
      return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error("Level ID is required"));
      }
      await this._deleteLevel.execute(id);
      return res.status(HttpStatus.OK).json(ApiResponse.success("Level deleted successfully"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST;
      return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
    }
  };
}

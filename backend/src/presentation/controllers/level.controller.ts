import { Request, Response } from "express";
import { CreateLevelUseCase } from "../../application/use-cases/level/admin/CreateLevelUseCase";
import { GetLevelsUseCase } from "../../application/use-cases/level/user/GetLevelsUseCase";
import { UpdateLevelUseCase } from "../../application/use-cases/level/admin/UpdateLevelUseCase";
import { DeleteLevelUseCase } from "../../application/use-cases/level/admin/DeleteLevelUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { CreateLevelDTO } from "../../application/dto/level/CreateLevelDTO";
import { UpdateLevelDTO } from "../../application/dto/level/UpdateLevelDTO";


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

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Levels retrieved successfully", levels));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
    }
  };



  create = async (req: Request, res: Response) => {
    try {
      const { levelNumber, minXp, maxXp, title } = req.body;

      if (
        levelNumber === undefined ||
        minXp === undefined ||
        maxXp === undefined
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: CreateLevelDTO = {
        levelNumber,
        minXp,
        maxXp,
        title,
      };

      const level = await this._createLevel.execute(dto);

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success(MESSAGES.LEVEL.CREATED, level));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };



  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.LEVEL.ID_REQUIRED));
      }

      const { levelNumber, minXp, maxXp, title } = req.body;

      const dto: UpdateLevelDTO = {
        levelNumber,
        minXp,
        maxXp,
        title,
      };

      const updated = await this._updateLevel.execute(id, dto);

      if (!updated) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(ApiResponse.error(MESSAGES.LEVEL.NOT_FOUND));
      }

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.LEVEL.UPDATED, updated));

    } catch (err: unknown) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
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
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
    }
  };
}
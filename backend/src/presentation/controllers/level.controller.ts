import { Request, Response } from "express";
import { ICreateLevelUseCase } from "../../application/interfaces/level/admin/ICreateLevelUseCase";
import { IGetLevelsUseCase } from "../../application/interfaces/level/user/IGetLevelsUseCase";
import { IUpdateLevelUseCase } from "../../application/interfaces/level/admin/IUpdateLevelUseCase";
import { IDeleteLevelUseCase } from "../../application/interfaces/level/admin/IDeleteLevelUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { CreateLevelDTO } from "../../application/dto/level/CreateLevelDTO";
import { UpdateLevelDTO } from "../../application/dto/level/UpdateLevelDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


export class LevelController {
  constructor(
    private readonly _createLevel: ICreateLevelUseCase,
    private readonly _getLevels: IGetLevelsUseCase,
    private readonly _updateLevel: IUpdateLevelUseCase,
    private readonly _deleteLevel: IDeleteLevelUseCase
  ) { }


  getAll = asyncHandler(async (req: Request, res: Response) => {
    const levels = await this._getLevels.execute();

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.LEVEL.FETCH_SUCCESS, levels));
  });



  create = asyncHandler(async (req: Request, res: Response) => {
    const { levelNumber, minXp, maxXp, title } = req.body;

    if (
      levelNumber === undefined ||
      minXp === undefined ||
      maxXp === undefined
    ) {
      throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const dto: CreateLevelDTO = {
      levelNumber,
      minXp,
      maxXp,
      title,
    };

    const level = await this._createLevel.execute(dto);

    res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(MESSAGES.LEVEL.CREATED, level));
  });



  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError(MESSAGES.LEVEL.ID_REQUIRED, HttpStatus.BAD_REQUEST);
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
      throw new AppError(MESSAGES.LEVEL.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.LEVEL.UPDATED, updated));
  });



  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(MESSAGES.LEVEL.ID_REQUIRED, HttpStatus.BAD_REQUEST);
    }
    await this._deleteLevel.execute(id);
    res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(MESSAGES.LEVEL.DELETED));
  });
}

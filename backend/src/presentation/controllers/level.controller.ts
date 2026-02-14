import { Request, Response } from "express";
import { CreateLevelUseCase } from "../../application/use-cases/level/admin/CreateLevelUseCase";
import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


export class LevelController {
  constructor(
    private readonly _createLevel: CreateLevelUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const { levelNumber, minXp, maxXp, title } = req.body;

      const level = await this._createLevel.execute({
        levelNumber,
        minXp,
        maxXp,
        title,
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
}

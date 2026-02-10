import { Request, Response } from "express";
import { CreateLevelUseCase } from "../../application/use-cases/level/admin/CreateLevelUseCase";
import { HttpStatus } from "../constants/httpStatus";


export class AdminLevelController {
  constructor(
    private readonly createLevelUseCase: CreateLevelUseCase
  ) {}

  
  create = async (req: Request, res: Response) => {
    const { levelNumber, minXp, maxXp, title } = req.body;

    const level = await this.createLevelUseCase.execute({
      levelNumber,
      minXp,
      maxXp,
      title
    });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      data: level
    });
  };
}

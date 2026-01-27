import { Request, Response } from "express";
import { GetDashboardUseCase } from "../../application/use-cases/user/getDashboardUseCase";

 

export class UserController {
  constructor(
    private readonly _getDashboardUseCase: GetDashboardUseCase
  ) {}

  getDashboard = async (req: Request, res: Response) => {
    const authUser = res.locals.user as { userId: string };

    const data = await this._getDashboardUseCase.execute(authUser.userId);

    res.status(200).json(data);
  };
}

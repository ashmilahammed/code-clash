import { Request, Response } from "express";
import { listUsersUseCase,updateUserStatusUseCase } from "../../infrastructure/di/admin.di";



//
export const listUsersController = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const status =
    req.query.status === "active" || req.query.status === "blocked"
      ? req.query.status
      : undefined;

  const result = await listUsersUseCase.execute(page, limit, status);
  res.json(result);
};


//
export const updateUserStatusController = async (req: any, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (status !== "active" && status !== "blocked") {
    return res.status(400).json({ message: "Invalid status value" });
  }

  await updateUserStatusUseCase.execute(
    req.user.role,
    userId,
    status
  );

  res.json({ message: "User status updated" });
};

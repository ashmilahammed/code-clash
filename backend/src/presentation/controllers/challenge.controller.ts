import { Request, Response } from "express";
import { CreateChallengeUseCase } from "../../application/use-cases/admin/createChallengeUseCase";
import { ListChallengesUseCase } from "../../application/use-cases/user/listChallengesUseCase";
import { ListAdminChallengesUseCase } from "../../application/use-cases/admin/listAdminChallengesUseCase";
import { ToggleChallengeStatusUseCase } from "../../application/use-cases/admin/toggleChallengeStatusUseCase";




export class ChallengeController {
    constructor(
        private readonly _createChallenge: CreateChallengeUseCase,
        private readonly _adminListChallenges: ListAdminChallengesUseCase,
        private readonly _userListChallenges: ListChallengesUseCase,
        private readonly _toggleChallenge: ToggleChallengeStatusUseCase
    ) { }

    create = async (req: Request, res: Response) => {
        const challenge = await this._createChallenge.execute(req.body);
        res.status(201).json({ data: challenge });
    };

    adminList = async (req: Request, res: Response) => {
        const result = await this._adminListChallenges.execute(req.query as any);
        res.status(200).json({ data: result });
    };

    userList = async (req: Request, res: Response) => {
        const result = await this._userListChallenges.execute(req.query as any);
        res.status(200).json({ data: result });
    };

    toggle = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { isActive } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Challenge ID is required" });
        }

        await this._toggleChallenge.execute(id, isActive);
        res.status(200).json({ message: "Status updated" });
    };
}

import { Request, Response } from "express";
import { GetAdminGroupsUseCase } from "../../application/use-cases/chat/GetAdminGroupsUseCase";
import { UpdateGroupStatusUseCase } from "../../application/use-cases/chat/UpdateGroupStatusUseCase";
import { DeleteGroupUseCase } from "../../application/use-cases/chat/DeleteGroupUseCase";

export class AdminChatController {
    constructor(
        private getAdminGroupsUseCase: GetAdminGroupsUseCase,
        private updateGroupStatusUseCase: UpdateGroupStatusUseCase,
        private deleteGroupUseCase: DeleteGroupUseCase
    ) { }

    getAdminGroups = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const search = (req.query.search as string) || undefined;

            const result = await this.getAdminGroupsUseCase.execute(page, limit, search);

            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    updateGroupStatus = async (req: Request, res: Response) => {
        try {
            const groupId = req.params.id as string;
            const { status } = req.body;

            if (!['active', 'inactive'].includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status" });
            }

            const updatedGroup = await this.updateGroupStatusUseCase.execute(groupId, status);

            res.status(200).json({
                success: true,
                message: "Group status updated successfully",
                data: updatedGroup
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    deleteGroup = async (req: Request, res: Response) => {
        try {
            const groupId = req.params.id as string;

            await this.deleteGroupUseCase.execute(groupId);

            res.status(200).json({
                success: true,
                message: "Group deleted successfully"
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}

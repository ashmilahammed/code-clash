import { Request, Response } from "express";
import { IReportMessageUseCase } from "../../application/interfaces/chat/user/IReportMessageUseCase";
import { IGetAllReportsUseCase } from "../../application/interfaces/chat/admin/IGetAllReportsUseCase";
import { IBanUserUseCase } from "../../application/interfaces/chat/admin/IBanUserUseCase";
import { IDismissReportUseCase } from "../../application/interfaces/chat/admin/IDismissReportUseCase";
import { IGetMessageByIdUseCase } from "../../application/interfaces/chat/user/IGetMessageByIdUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { ReportMessageDTO } from "../../application/dto/report/ReportMessageDTO";
import { GetReportsQueryDTO } from "../../application/dto/report/GetReportsQueryDTO";
import { BanUserFromReportDTO } from "../../application/dto/report/BanUserFromReportDTO";
import { ReportReason } from "../../domain/entities/chat/Report";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


interface AuthUserContext {
    userId: string;
    role: "user" | "admin";
}

export class ReportController {
    constructor(
        private readonly _reportMessageUseCase: IReportMessageUseCase,
        private readonly _getAllReportsUseCase: IGetAllReportsUseCase,
        private readonly _banUserUseCase: IBanUserUseCase,
        private readonly _dismissReportUseCase: IDismissReportUseCase,
        private readonly _getMessageByIdUseCase: IGetMessageByIdUseCase
    ) { }


    reportMessage = asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user as AuthUserContext | undefined;

        if (!user) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const { messageId, reason } = req.body;

        if (!messageId || !reason) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        // validation
        const validReasons: ReportReason[] = [
            "Spam",
            "Abuse",
            "Harassment",
            "Inappropriate",
            "Other",
        ];

        if (!validReasons.includes(reason)) {
            throw new AppError("Invalid report reason", HttpStatus.BAD_REQUEST);
        }

        const dto: ReportMessageDTO = {
            reportedById: user.userId,
            messageId,
            reason,
        };

        const report = await this._reportMessageUseCase.execute(dto);

        res
            .status(HttpStatus.CREATED)
            .json(ApiResponse.success("Message reported successfully", report));
    });




    getAllReports = asyncHandler(async (req: Request, res: Response) => {
        const dto: GetReportsQueryDTO = {
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 8),
        };

        if (typeof req.query.status === "string") {
            dto.status = req.query.status;
        }

        const result = await this._getAllReportsUseCase.execute(
            dto.page,
            dto.limit,
            dto.status
        );

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));
    });



    banUser = asyncHandler(async (req: Request, res: Response) => {
        const { userId, days, reason, reportId } = req.body;

        if (!userId || !days || !reason || !reportId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: BanUserFromReportDTO = {
            userId,
            days,
            reason,
            reportId,
        };

        await this._banUserUseCase.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success("User banned successfully"));
    });


    dismissReport = asyncHandler(async (req: Request, res: Response) => {
        const { reportId } = req.params;

        if (!reportId) {
            throw new AppError("Report ID is required", HttpStatus.BAD_REQUEST);
        }

        await this._dismissReportUseCase.execute(reportId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success("Report dismissed successfully"));
    });



    getReportedMessage = asyncHandler(async (req: Request, res: Response) => {
        const { messageId } = req.params;

        if (!messageId) {
            throw new AppError("Message ID is required", HttpStatus.BAD_REQUEST);
        }

        const message = await this._getMessageByIdUseCase.execute(messageId);

        if (!message) {
            throw new AppError("Message not found", HttpStatus.NOT_FOUND);
        }

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, message));
    });
}
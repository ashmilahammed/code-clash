import { Request, Response } from "express";
import { ReportMessageUseCase } from "../../application/use-cases/chat/ReportMessageUseCase";
import { GetAllReportsUseCase } from "../../application/use-cases/chat/GetAllReportsUseCase";
import { BanUserUseCase } from "../../application/use-cases/user/BanUserUseCase";
import { DismissReportUseCase } from "../../application/use-cases/chat/DismissReportUseCase";
import { GetMessageByIdUseCase } from "../../application/use-cases/chat/GetMessageByIdUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { ReportMessageDTO } from "../../application/dto/report/ReportMessageDTO";
import { GetReportsQueryDTO } from "../../application/dto/report/GetReportsQueryDTO";
import { BanUserFromReportDTO } from "../../application/dto/report/BanUserFromReportDTO";
import { ReportReason } from "../../domain/entities/chat/Report";


interface AuthUserContext {
    userId: string;
    role: "user" | "admin";
}

export class ReportController {
    constructor(
        private readonly _reportMessageUseCase: ReportMessageUseCase,
        private readonly _getAllReportsUseCase: GetAllReportsUseCase,
        private readonly _banUserUseCase: BanUserUseCase,
        private readonly _dismissReportUseCase: DismissReportUseCase,
        private readonly _getMessageByIdUseCase: GetMessageByIdUseCase
    ) { }


    reportMessage = async (req: Request, res: Response) => {
        try {
            const user = res.locals.user as AuthUserContext | undefined;

            if (!user) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
            }

            const { messageId, reason } = req.body;

            if (!messageId || !reason) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
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
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error("Invalid report reason"));
            }

            const dto: ReportMessageDTO = {
                reportedById: user.userId,
                messageId,
                reason,
            };

            const report = await this._reportMessageUseCase.execute(dto);

            return res
                .status(HttpStatus.CREATED)
                .json(ApiResponse.success("Message reported successfully", report));

        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };




    getAllReports = async (req: Request, res: Response) => {
        try {

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

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));

        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
        }
    };



    banUser = async (req: Request, res: Response) => {
        try {
            const { userId, days, reason, reportId } = req.body;

            if (!userId || !days || !reason || !reportId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: BanUserFromReportDTO = {
                userId,
                days,
                reason,
                reportId,
            };

            await this._banUserUseCase.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success("User banned successfully"));
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };


    dismissReport = async (req: Request, res: Response) => {
        try {
            const { reportId } = req.params;

            if (!reportId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error("Report ID is required"));
            }

            await this._dismissReportUseCase.execute(reportId);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success("Report dismissed successfully"));
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };



    getReportedMessage = async (req: Request, res: Response) => {
        try {
            const { messageId } = req.params;

            if (!messageId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error("Message ID is required"));
            }

            const message = await this._getMessageByIdUseCase.execute(messageId);

            if (!message) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(ApiResponse.error("Message not found"));
            }

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, message));
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };
}
import { Request, Response } from "express";
import { ISubmitSolutionUseCase } from "../../application/interfaces/submission/ISubmitSolutionUseCase";
import { IRunCodeUseCase } from "../../application/interfaces/submission/IRunCodeUseCase";

import { RunCodeDTO } from "../../application/dto/submission/RunCodeDTO";
import { SubmitSolutionDTO } from "../../application/dto/submission/SubmitSolutionDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


interface AuthUserContext {
    userId: string;
    role: "user" | "admin";
}

export class SubmissionController {
    constructor(
        private readonly _submitUseCase: ISubmitSolutionUseCase,
        private readonly _runUseCase: IRunCodeUseCase
    ) { }


    run = asyncHandler(async (req: Request, res: Response) => {
        const { language, code, input } = req.body;

        if (!language || !code) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: RunCodeDTO = {
            language,
            code,
            input,
        };

        const result = await this._runUseCase.execute(
            dto.language,
            dto.code,
            dto.input ?? ""
        );

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.SUBMISSION.RUN_SUCCESS, result));
    });



    submit = asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user as AuthUserContext | undefined;

        if (!user) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const { language, code, challengeId } = req.body;

        if (!language || !code || !challengeId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: SubmitSolutionDTO = {
            userId: user.userId,
            challengeId,
            language,
            code,
        };

        const result = await this._submitUseCase.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.SUBMISSION.SUBMIT_SUCCESS, result));
    });
}
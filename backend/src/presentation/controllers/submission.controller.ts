import { Request, Response } from "express";
import { SubmitSolutionUseCase } from "../../application/use-cases/submission/SubmitSolutionUseCase";
import { RunCodeUseCase } from "../../application/use-cases/submission/RunCodeUseCase";

import { RunCodeDTO } from "../../application/dto/submission/RunCodeDTO";
import { SubmitSolutionDTO } from "../../application/dto/submission/SubmitSolutionDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


interface AuthUserContext {
    userId: string;
    role: "user" | "admin";
}

export class SubmissionController {
    constructor(
        private readonly _submitUseCase: SubmitSolutionUseCase,
        private readonly _runUseCase: RunCodeUseCase
    ) { }


    run = async (req: Request, res: Response) => {
        try {
            const { language, code, input } = req.body;

            if (!language || !code) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: RunCodeDTO = {
                language,
                code,
                input,
            };

            const result = await this._runUseCase.execute(
                dto.language,
                dto.code,
                // dto.input
                dto.input ?? ""
            );

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.SUBMISSION.RUN_SUCCESS, result));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    submit = async (req: Request, res: Response) => {
        try {
            const user = res.locals.user as AuthUserContext | undefined;

            if (!user) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
            }

            const { language, code, challengeId } = req.body;

            if (!language || !code || !challengeId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: SubmitSolutionDTO = {
                userId: user.userId,
                challengeId,
                language,
                code,
            };

            const result = await this._submitUseCase.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.SUBMISSION.SUBMIT_SUCCESS, result));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };
}
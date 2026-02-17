import { Request, Response } from "express";
import { SubmitSolutionUseCase } from "../../application/use-cases/submission/SubmitSolutionUseCase";
import { RunCodeUseCase } from "../../application/use-cases/submission/RunCodeUseCase";

import { MESSAGES } from "../constants/messages";
import { HttpStatus } from "../constants/httpStatus";
import { ApiResponse } from "../common/ApiResponse";



export class SubmissionController {
    constructor(
        private readonly submitUseCase: SubmitSolutionUseCase,
        private readonly runUseCase: RunCodeUseCase
    ) { }


    run = async (req: Request, res: Response) => {
        try {
            const { language, code, input } = req.body;

            const result = await this.runUseCase.execute(
                language,
                code,
                input
            );

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.SUBMISSION.RUN_SUCCESS, result));

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message))
        }
    };




    submit = async (req: Request, res: Response) => {
        try {
            const { language, code, challengeId } = req.body;

            const userId = res.locals.user.userId;

            const result = await this.submitUseCase.execute({
                userId,
                challengeId,
                language,
                code,
            });

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.SUBMISSION.SUBMIT_SUCCESS, result));

        } catch (err: any) {
            console.error("Submit Error:", err);
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message, err.response?.data || err));
        }
    };
}

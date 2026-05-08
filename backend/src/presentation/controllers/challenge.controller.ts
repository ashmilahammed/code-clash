import { Request, Response } from "express";

import { IListChallengesUseCase } from "../../application/interfaces/challenge/user/IListChallengesUseCase";
import { IGetChallengeLanguagesUseCase } from "../../application/interfaces/challenge/user/IGetChallengeLanguagesUseCase";

import { IGetChallengeByIdUseCase } from "../../application/interfaces/challenge/user/IGetChallengeByIdUseCase";
import { IGetChallengeCodeTemplatesUseCase } from "../../application/interfaces/challenge/user/IGetChallengeCodeTemplatesUseCase";
import { IGetChallengeHintsUseCase } from "../../application/interfaces/challenge/user/IGetChallengeHintsUseCase";
import { IGetChallengeTestCasesUseCase } from "../../application/interfaces/challenge/user/IGetChallengeTestCasesUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { ListQuery } from "../../domain/types/ListQuery";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


export class ChallengeController {
    constructor(
        private readonly _userListChallenges: IListChallengesUseCase,
        private readonly _getChallengeLanguages: IGetChallengeLanguagesUseCase,
        private readonly _getChallengeById: IGetChallengeByIdUseCase,
        private readonly _getChallengeTemplates: IGetChallengeCodeTemplatesUseCase,
        private readonly _getHints: IGetChallengeHintsUseCase,
        private readonly _getTestCases: IGetChallengeTestCasesUseCase,
    ) { }



    userList = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._userListChallenges.execute(req.query as unknown as ListQuery);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, result));
    });



    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const challenge = await this._getChallengeById.execute(id);

        if (!challenge) {
            throw new AppError(MESSAGES.CHALLENGE.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.FETCHED, challenge));
    });



    getChallengeLanguages = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const languages = await this._getChallengeLanguages.execute(id);

        res
            .status(HttpStatus.OK)
            .json(
                ApiResponse.success(
                    MESSAGES.CHALLENGE.LANGUAGES_FETCHED,
                    languages
                )
            );
    });



    getTemplates = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const user = res.locals.user as { userId: string } | undefined;
        if (!user) {
          throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const templates = await this._getChallengeTemplates.execute(id, user.userId);

        if (!templates || templates.length === 0) {
            throw new AppError(MESSAGES.CHALLENGE.TEMPLATES_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        res.status(HttpStatus.OK).json(
            ApiResponse.success(MESSAGES.CHALLENGE.TEMPLATES_FETCHED, templates)
        );
    });



    getHints = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const hints = await this._getHints.execute(id);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.HINTS_FETCHED, hints));
    });


    getTestCases = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const testCases = await this._getTestCases.execute(id);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.TEST_CASES_FETCHED, testCases));
    });
}
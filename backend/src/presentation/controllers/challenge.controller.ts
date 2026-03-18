import { Request, Response } from "express";

import { ListChallengesUseCase } from "../../application/use-cases/challenge/user/listChallengesUseCase";
import { GetChallengeLanguagesUseCase } from "../../application/use-cases/challenge/user/getChallengeLanguagesUseCase";

import { GetChallengeByIdUseCase } from "../../application/use-cases/challenge/user/getChallengeByIdUseCase";
import { GetChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/user/getChallengeCodeTemplatesUseCase";
import { GetChallengeHintsUseCase } from "../../application/use-cases/challenge/user/getChallengeHintsUseCase";
import { GetChallengeTestCasesUseCase } from "../../application/use-cases/challenge/user/getChallengeTestCasesUseCase";

import { ChallengeDifficulty, ChallengeDomain } from "../../domain/entities/challenge/Challenge";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";




export class ChallengeController {
    constructor(
        private readonly _userListChallenges: ListChallengesUseCase,
        private readonly _getChallengeLanguages: GetChallengeLanguagesUseCase,
        private readonly _getChallengeById: GetChallengeByIdUseCase,
        private readonly _getChallengeTemplates: GetChallengeCodeTemplatesUseCase,
        private readonly _getHints: GetChallengeHintsUseCase,
        private readonly _getTestCases: GetChallengeTestCasesUseCase,
    ) { }



    userList = async (req: Request, res: Response) => {
        try {
            const result = await this._userListChallenges.execute(req.query as any);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, result));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const challenge = await this._getChallengeById.execute(id);

            if (!challenge) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.NOT_FOUND));
            }

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.FETCHED, challenge));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    getChallengeLanguages = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const languages = await this._getChallengeLanguages.execute(id);

            return res
                .status(HttpStatus.OK)
                .json(
                    ApiResponse.success(
                        MESSAGES.CHALLENGE.LANGUAGES_FETCHED,
                        languages
                    )
                );
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    getTemplates = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const user = res.locals.user as { userId: string } | undefined;
      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const templates = await this._getChallengeTemplates.execute(id, user.userId);

            if (!templates || templates.length === 0) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.TEMPLATES_NOT_FOUND));
            }

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(MESSAGES.CHALLENGE.TEMPLATES_FETCHED, templates)
            );
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };





    getHints = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const hints = await this._getHints.execute(id);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.HINTS_FETCHED, hints));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };


    getTestCases = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const testCases = await this._getTestCases.execute(id);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.TEST_CASES_FETCHED, testCases));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };




}
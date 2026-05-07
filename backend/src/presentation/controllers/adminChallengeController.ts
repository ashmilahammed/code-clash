import { Request, Response } from "express";
import { ICreateChallengeUseCase } from "../../application/interfaces/challenge/admin/ICreateChallengeUseCase";
import { IListAdminChallengesUseCase } from "../../application/interfaces/challenge/admin/IListAdminChallengesUseCase";
import { IToggleChallengeStatusUseCase } from "../../application/interfaces/challenge/admin/IToggleChallengeStatusUseCase";
import { IAddChallengeTagsUseCase } from "../../application/interfaces/challenge/admin/IAddChallengeTagsUseCase";

import { IGetAvailableLanguagesUseCase } from "../../application/interfaces/challenge/admin/IGetAvailableLanguagesUseCase";
import { IGetChallengeLanguagesUseCase } from "../../application/interfaces/challenge/user/IGetChallengeLanguagesUseCase";
import { IAddChallengeLanguagesUseCase } from "../../application/interfaces/challenge/admin/IAddChallengeLanguagesUseCase";

import { IAddChallengeTestCasesUseCase } from "../../application/interfaces/challenge/admin/IAddChallengeTestCasesUseCase";
import { IAddChallengeHintsUseCase } from "../../application/interfaces/challenge/admin/IAddChallengeHintsUseCase";
import { IUpdateChallengeScheduleUseCase } from "../../application/interfaces/challenge/admin/IUpdateChallengeScheduleUseCase";
import { IAddChallengeCodeTemplatesUseCase } from "../../application/interfaces/challenge/admin/IAddChallengeCodeTemplatesUseCase";
import { IUpdateChallengeUseCase } from "../../application/interfaces/challenge/admin/IUpdateChallengeUseCase";
import { IGetAdminChallengeCodeTemplatesUseCase } from "../../application/interfaces/challenge/admin/IGetAdminChallengeCodeTemplatesUseCase";
import { IGetAdminChallengeTestCasesUseCase } from "../../application/interfaces/challenge/admin/IGetAdminChallengeTestCasesUseCase";
import { IGetAdminChallengeByIdUseCase } from "../../application/interfaces/challenge/admin/IGetAdminChallengeByIdUseCase";
import { IDeleteChallengeUseCase } from "../../application/interfaces/challenge/admin/IDeleteChallengeUseCase";


import { CreateChallengeDTO } from "../../application/dto/challenge/CreateChallengeDTO";
import { UpdateChallengeDTO } from "../../application/dto/challenge/UpdateChallengeDTO";
import { ToggleChallengeDTO } from "../../application/dto/challenge/ToggleChallengeDTO";
// import { AdminListChallengesQueryDTO } from "../../application/dto/challenge/AdminListChallengesQueryDTO";
import { ListQuery } from "../../domain/types/ListQuery";

// import { ChallengeDifficulty, ChallengeDomain } from "../../domain/entities/challenge/Challenge";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";




export class AdminChallengeController {
    constructor(
        private readonly _createChallenge: ICreateChallengeUseCase,
        private readonly _adminListChallenges: IListAdminChallengesUseCase,
        private readonly _toggleChallenge: IToggleChallengeStatusUseCase,
        private readonly _addTags: IAddChallengeTagsUseCase,
        private readonly _getLanguages: IGetAvailableLanguagesUseCase,
        private readonly _getChallengeLanguages: IGetChallengeLanguagesUseCase,
        private readonly _addLanguages: IAddChallengeLanguagesUseCase,
        private readonly _addTestCases: IAddChallengeTestCasesUseCase,
        private readonly _addHints: IAddChallengeHintsUseCase,
        private readonly _updateSchedule: IUpdateChallengeScheduleUseCase,
        private readonly _addTemplates: IAddChallengeCodeTemplatesUseCase,
        private readonly _updateChallenge: IUpdateChallengeUseCase,
        private readonly _getAdminChallengeCodeTemplates: IGetAdminChallengeCodeTemplatesUseCase,
        private readonly _getAdminChallengeTestCases: IGetAdminChallengeTestCasesUseCase,
        private readonly _getAdminChallengeById: IGetAdminChallengeByIdUseCase,
        private readonly _deleteChallenge: IDeleteChallengeUseCase,
    ) { }


    create = async (req: Request, res: Response) => {
        try {
            const dto: CreateChallengeDTO = {
                title: req.body.title,
                description: req.body.description,
                difficulty: req.body.difficulty,
                domain: req.body.domain,
                xpReward: req.body.xpReward,
                timeLimitMinutes: req.body.timeLimitMinutes,
                isPremium: req.body.isPremium,
            };

            const challenge = await this._createChallenge.execute(dto);

            return res
                .status(HttpStatus.CREATED)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.CREATED, challenge));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };


    update = async (req: Request, res: Response) => {
        try {
            const challengeId = req.params.id;

            if (!challengeId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const dto: UpdateChallengeDTO = {
                challengeId: challengeId,
                title: req.body.title,
                description: req.body.description,
                difficulty: req.body.difficulty,
                domain: req.body.domain,
                xpReward: req.body.xpReward,
                timeLimitMinutes: req.body.timeLimitMinutes,
                isPremium: req.body.isPremium,
            };

            const result = await this._updateChallenge.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.UPDATED, result));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    adminList = async (req: Request, res: Response) => {
        try {
            const result = await this._adminListChallenges.execute(req.query as unknown as ListQuery);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, result));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };




    getAdminById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const challenge = await this._getAdminChallengeById.execute(id);

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




    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            await this._deleteChallenge.execute(id);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.DELETED));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    toggle = async (req: Request, res: Response) => {
        try {
            const challengeId = req.params.id;

            if (!challengeId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const dto: ToggleChallengeDTO = {
                challengeId: challengeId,
                isActive: req.body.isActive,
            };

            await this._toggleChallenge.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.STATUS_UPDATED));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };




    addTags = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { tags } = req.body;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            if (!Array.isArray(tags) || tags.length === 0) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.INVALID_DATA));
            }

            await this._addTags.execute(id, tags);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.TAGS_ADDED));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };




    getLanguages = async (_: Request, res: Response) => {
        try {
            const langs = await this._getLanguages.execute();

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.LANGUAGES_FETCHED, langs));

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



    addLanguages = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { languages } = req.body;

            if (!id || !Array.isArray(languages)) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.INVALID_DATA));
            }

            await this._addLanguages.execute(id, languages);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.TAGS_ADDED));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };





    addTestCases = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { testCases } = req.body;

            if (!id || !Array.isArray(testCases)) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.INVALID_DATA));
            }

            await this._addTestCases.execute(id, testCases);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };




    addHints = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { hints } = req.body;

            if (!id || !Array.isArray(hints)) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.INVALID_DATA));
            }

            await this._addHints.execute(id, hints);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };


    updateSchedule = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            await this._updateSchedule.execute(id, req.body);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };




    addCodeTemplates = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { templates } = req.body;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            if (!Array.isArray(templates) || templates.length === 0) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.INVALID_DATA));
            }

            await this._addTemplates.execute(id, templates);

            return res
                .status(HttpStatus.OK)
                .json(
                    ApiResponse.success(MESSAGES.COMMON.SUCCESS)
                );
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };




    getAdminTemplates = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const templates = await this._getAdminChallengeCodeTemplates.execute(id);

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(MESSAGES.CHALLENGE.TEMPLATES_FETCHED, templates)
            );
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };


    getAdminTestCases = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const testCases = await this._getAdminChallengeTestCases.execute(id);

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(MESSAGES.CHALLENGE.TEST_CASES_FETCHED, testCases)
            );
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };
}
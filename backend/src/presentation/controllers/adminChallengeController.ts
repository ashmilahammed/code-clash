import { Request, Response } from "express";
import { CreateChallengeUseCase } from "../../application/use-cases/challenge/admin/createChallengeUseCase";
import { ListAdminChallengesUseCase } from "../../application/use-cases/challenge/admin/listAdminChallengesUseCase";
import { ToggleChallengeStatusUseCase } from "../../application/use-cases/challenge/admin/toggleChallengeStatusUseCase";
import { AddChallengeTagsUseCase } from "../../application/use-cases/challenge/admin/addChallengeTagsUseCase";

import { GetAvailableLanguagesUseCase } from "../../application/use-cases/challenge/admin/getAvailableLanguagesUseCase";
import { GetChallengeLanguagesUseCase } from "../../application/use-cases/challenge/user/getChallengeLanguagesUseCase";
import { AddChallengeLanguagesUseCase } from "../../application/use-cases/challenge/admin/addChallengeLanguagesUseCase";

import { AddChallengeTestCasesUseCase } from "../../application/use-cases/challenge/admin/addChallengeTestCasesUseCase";
import { AddChallengeHintsUseCase } from "../../application/use-cases/challenge/admin/addChallengeHintsUseCase";
import { UpdateChallengeScheduleUseCase } from "../../application/use-cases/challenge/admin/updateChallengeScheduleUseCase";
import { AddChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/admin/addChallengeCodeTemplatesUseCase";
import { UpdateChallengeUseCase } from "../../application/use-cases/challenge/admin/updateChallengeUseCase";
import { GetAdminChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/admin/getAdminChallengeCodeTemplatesUseCase";
import { GetAdminChallengeTestCasesUseCase } from "../../application/use-cases/challenge/admin/getAdminChallengeTestCasesUseCase";
import { GetAdminChallengeByIdUseCase } from "../../application/use-cases/challenge/admin/getAdminChallengeByIdUseCase";
import { DeleteChallengeUseCase } from "../../application/use-cases/challenge/admin/deleteChallengeUseCase";


import { CreateChallengeDTO } from "../../application/dto/challenge/CreateChallengeDTO";
import { UpdateChallengeDTO } from "../../application/dto/challenge/UpdateChallengeDTO";
import { ToggleChallengeDTO } from "../../application/dto/challenge/ToggleChallengeDTO";
// import { AdminListChallengesQueryDTO } from "../../application/dto/challenge/AdminListChallengesQueryDTO";

// import { ChallengeDifficulty, ChallengeDomain } from "../../domain/entities/challenge/Challenge";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";




export class AdminChallengeController {
    constructor(
        private readonly _createChallenge: CreateChallengeUseCase,
        private readonly _adminListChallenges: ListAdminChallengesUseCase,
        private readonly _toggleChallenge: ToggleChallengeStatusUseCase,
        private readonly _addTags: AddChallengeTagsUseCase,
        private readonly _getLanguages: GetAvailableLanguagesUseCase,
        private readonly _getChallengeLanguages: GetChallengeLanguagesUseCase,
        private readonly _addLanguages: AddChallengeLanguagesUseCase,
        private readonly _addTestCases: AddChallengeTestCasesUseCase,
        private readonly _addHints: AddChallengeHintsUseCase,
        private readonly _updateSchedule: UpdateChallengeScheduleUseCase,
        private readonly _addTemplates: AddChallengeCodeTemplatesUseCase,
        private readonly _updateChallenge: UpdateChallengeUseCase,
        private readonly _getAdminChallengeCodeTemplates: GetAdminChallengeCodeTemplatesUseCase,
        private readonly _getAdminChallengeTestCases: GetAdminChallengeTestCasesUseCase,
        private readonly _getAdminChallengeById: GetAdminChallengeByIdUseCase,
        private readonly _deleteChallenge: DeleteChallengeUseCase,
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
            const result = await this._adminListChallenges.execute(req.query as any);

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
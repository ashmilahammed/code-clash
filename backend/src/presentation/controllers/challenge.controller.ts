import { Request, Response } from "express";
import { CreateChallengeUseCase } from "../../application/use-cases/challenge/admin/createChallengeUseCase";
import { ListChallengesUseCase } from "../../application/use-cases/challenge/user/listChallengesUseCase";
import { ListAdminChallengesUseCase } from "../../application/use-cases/challenge/admin/listAdminChallengesUseCase";
import { ToggleChallengeStatusUseCase } from "../../application/use-cases/challenge/admin/toggleChallengeStatusUseCase";
import { AddChallengeTagsUseCase } from "../../application/use-cases/challenge/admin/addChallengeTagsUseCase";
import { GetAvailableLanguagesUseCase } from "../../application/use-cases/challenge/admin/getAvailableLanguagesUseCase";
import { AddChallengeLanguagesUseCase } from "../../application/use-cases/challenge/admin/addChallengeLanguagesUseCase";
import { GetChallengeLanguagesUseCase } from "../../application/use-cases/challenge/user/getChallengeLanguagesUseCase";

import { AddChallengeTestCasesUseCase } from "../../application/use-cases/challenge/admin/addChallengeTestCasesUseCase";
import { AddChallengeHintsUseCase } from "../../application/use-cases/challenge/admin/addChallengeHintsUseCase";
import { UpdateChallengeScheduleUseCase } from "../../application/use-cases/challenge/admin/updateChallengeScheduleUseCase";
import { AddChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/admin/addChallengeCodeTemplatesUseCase";
import { UpdateChallengeUseCase } from "../../application/use-cases/challenge/admin/updateChallengeUseCase";
import { GetAdminChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/admin/getAdminChallengeCodeTemplatesUseCase";
import { GetAdminChallengeTestCasesUseCase } from "../../application/use-cases/challenge/admin/getAdminChallengeTestCasesUseCase";

import { GetChallengeByIdUseCase } from "../../application/use-cases/challenge/user/getChallengeByIdUseCase";
import { GetChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/user/getChallengeCodeTemplatesUseCase";
import { GetChallengeHintsUseCase } from "../../application/use-cases/challenge/user/getChallengeHintsUseCase";
import { GetChallengeTestCasesUseCase } from "../../application/use-cases/challenge/user/getChallengeTestCasesUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";



export class ChallengeController {
    constructor(
        private readonly _createChallenge: CreateChallengeUseCase,
        private readonly _adminListChallenges: ListAdminChallengesUseCase,
        private readonly _userListChallenges: ListChallengesUseCase,
        private readonly _toggleChallenge: ToggleChallengeStatusUseCase,
        private readonly _addTags: AddChallengeTagsUseCase,
        private readonly _getLanguages: GetAvailableLanguagesUseCase,
        private readonly _addLanguages: AddChallengeLanguagesUseCase,
        private readonly _getChallengeLanguages: GetChallengeLanguagesUseCase,
        private readonly _addTestCases: AddChallengeTestCasesUseCase,
        private readonly _addHints: AddChallengeHintsUseCase,
        private readonly _updateSchedule: UpdateChallengeScheduleUseCase,
        private readonly _addTemplates: AddChallengeCodeTemplatesUseCase,
        private readonly _getChallengeById: GetChallengeByIdUseCase,
        private readonly _getChallengeTemplates: GetChallengeCodeTemplatesUseCase,
        private readonly _getHints: GetChallengeHintsUseCase,
        private readonly _getTestCases: GetChallengeTestCasesUseCase,
        private readonly _updateChallenge: UpdateChallengeUseCase,
        private readonly _getAdminChallengeCodeTemplates: GetAdminChallengeCodeTemplatesUseCase,
        private readonly _getAdminChallengeTestCases: GetAdminChallengeTestCasesUseCase
    ) { }


    create = async (req: Request, res: Response) => {
        try {
            const challenge = await this._createChallenge.execute(req.body);

            return res.status(HttpStatus.CREATED).json(
                ApiResponse.success(MESSAGES.CHALLENGE.CREATED, {
                    id: challenge.id,
                    status: challenge.status,
                })
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };


    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            const challenge = await this._updateChallenge.execute(id, req.body);

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(MESSAGES.CHALLENGE.UPDATED, {
                    id: challenge.id,
                    status: challenge.status,
                })
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };



    adminList = async (req: Request, res: Response) => {
        try {
            const result = await this._adminListChallenges.execute(req.query as any);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, result));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };


    userList = async (req: Request, res: Response) => {
        try {
            const result = await this._userListChallenges.execute(req.query as any);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, result));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
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
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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

            const templates = await this._getChallengeTemplates.execute(id);

            if (!templates || templates.length === 0) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.TEMPLATES_NOT_FOUND));
            }

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(MESSAGES.CHALLENGE.TEMPLATES_FETCHED, templates)
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
        }
    };





    toggle = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.CHALLENGE.ID_REQUIRED));
            }

            await this._toggleChallenge.execute(id, isActive);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHALLENGE.STATUS_UPDATED));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.BAD_REQUEST;

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
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
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
        }
    };




    getLanguages = async (_: Request, res: Response) => {
        try {
            const langs = await this._getLanguages.execute();

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success("Languages fetched successfully", langs));

        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                .json(ApiResponse.success("Languages added"));
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                .json(ApiResponse.success("Test cases added successfully"));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                .json(ApiResponse.success("Hints added successfully"));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                .json(ApiResponse.success("Schedule updated successfully"));
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                .json(ApiResponse.success("Hints fetched successfully", hints));
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                .json(ApiResponse.success("Test cases fetched successfully", testCases));
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
                    ApiResponse.success("Code templates saved successfully")
                );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
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
            const message =
                err instanceof Error
                    ? err.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(message));
        }
    };
}

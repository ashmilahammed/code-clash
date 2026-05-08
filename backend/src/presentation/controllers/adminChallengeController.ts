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
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";




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


    create = asyncHandler(async (req: Request, res: Response) => {
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

        res
            .status(HttpStatus.CREATED)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.CREATED, challenge));
    });


    update = asyncHandler(async (req: Request, res: Response) => {
        const challengeId = req.params.id;

        if (!challengeId) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
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

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.UPDATED, result));
    });



    adminList = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._adminListChallenges.execute(req.query as unknown as ListQuery);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, result));
    });




    getAdminById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const challenge = await this._getAdminChallengeById.execute(id);

        if (!challenge) {
            throw new AppError(MESSAGES.CHALLENGE.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.FETCHED, challenge));
    });




    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        await this._deleteChallenge.execute(id);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.DELETED));
    });



    toggle = asyncHandler(async (req: Request, res: Response) => {
        const challengeId = req.params.id;

        if (!challengeId) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const dto: ToggleChallengeDTO = {
            challengeId: challengeId,
            isActive: req.body.isActive,
        };

        await this._toggleChallenge.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.STATUS_UPDATED));
    });




    addTags = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { tags } = req.body;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        if (!Array.isArray(tags) || tags.length === 0) {
            throw new AppError(MESSAGES.CHALLENGE.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        await this._addTags.execute(id, tags);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.TAGS_ADDED));
    });




    getLanguages = asyncHandler(async (_: Request, res: Response) => {
        const langs = await this._getLanguages.execute();

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.LANGUAGES_FETCHED, langs));
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



    addLanguages = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { languages } = req.body;

        if (!id || !Array.isArray(languages)) {
            throw new AppError(MESSAGES.CHALLENGE.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        await this._addLanguages.execute(id, languages);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHALLENGE.TAGS_ADDED));
    });





    addTestCases = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { testCases } = req.body;

        if (!id || !Array.isArray(testCases)) {
            throw new AppError(MESSAGES.CHALLENGE.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        await this._addTestCases.execute(id, testCases);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS));
    });




    addHints = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { hints } = req.body;

        if (!id || !Array.isArray(hints)) {
            throw new AppError(MESSAGES.CHALLENGE.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        await this._addHints.execute(id, hints);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS));
    });


    updateSchedule = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        await this._updateSchedule.execute(id, req.body);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS));
    });




    addCodeTemplates = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { templates } = req.body;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        if (!Array.isArray(templates) || templates.length === 0) {
            throw new AppError(MESSAGES.CHALLENGE.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        await this._addTemplates.execute(id, templates);

        res
            .status(HttpStatus.OK)
            .json(
                ApiResponse.success(MESSAGES.COMMON.SUCCESS)
            );
    });




    getAdminTemplates = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const templates = await this._getAdminChallengeCodeTemplates.execute(id);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(MESSAGES.CHALLENGE.TEMPLATES_FETCHED, templates)
        );
    });


    getAdminTestCases = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.CHALLENGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const testCases = await this._getAdminChallengeTestCases.execute(id);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(MESSAGES.CHALLENGE.TEST_CASES_FETCHED, testCases)
        );
    });
}
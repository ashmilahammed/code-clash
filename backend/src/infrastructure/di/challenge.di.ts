import { ChallengeRepository } from "../repositories/ChallengeRepository";
import { ChallengeTagRepository } from "../repositories/ChallengeTagRepository";
import { ProgrammingLanguageRepository } from "../repositories/ProgrammingLanguageRepository";
import { ChallengeTestCaseRepository } from "../repositories/ChallengeTestCaseRepository";
import { ChallengeHintRepository } from "../repositories/ChallengeHintRepository";
import { ChallengeCodeTemplateRepository } from "../repositories/ChallengeCodeTemplateRepository";

import { CreateChallengeUseCase } from "../../application/use-cases/admin/createChallengeUseCase";
import { ListAdminChallengesUseCase } from "../../application/use-cases/admin/listAdminChallengesUseCase";
import { ListChallengesUseCase } from "../../application/use-cases/user/listChallengesUseCase";
import { ToggleChallengeStatusUseCase } from "../../application/use-cases/admin/toggleChallengeStatusUseCase";
import { AddChallengeTagsUseCase } from "../../application/use-cases/admin/addChallengeTagsUseCase";

import { GetAvailableLanguagesUseCase } from "../../application/use-cases/admin/getAvailableLanguagesUseCase";
import { AddChallengeLanguagesUseCase } from "../../application/use-cases/admin/addChallengeLanguagesUseCase";
import { GetChallengeLanguagesUseCase } from "../../application/use-cases/admin/getChallengeLanguagesUseCase";

import { AddChallengeTestCasesUseCase } from "../../application/use-cases/admin/addChallengeTestCasesUseCase";
import { AddChallengeHintsUseCase } from "../../application/use-cases/admin/addChallengeHintsUseCase";
import { UpdateChallengeScheduleUseCase } from "../../application/use-cases/admin/updateChallengeScheduleUseCase";
import { AddChallengeCodeTemplatesUseCase } from "../../application/use-cases/admin/AddChallengeCodeTemplatesUseCase";

import { GetChallengeByIdUseCase } from "../../application/use-cases/user/getChallengeByIdUseCase";

import { ChallengeController } from "../../presentation/controllers/challenge.controller";

// repository
const challengeRepository = new ChallengeRepository();
const challengeTagRepository = new ChallengeTagRepository();
const programmingLanguageRepository = new ProgrammingLanguageRepository();
const challengeTestCaseRepository = new ChallengeTestCaseRepository();
const challengeHintRepository = new ChallengeHintRepository();
const codeTemplateRepository = new ChallengeCodeTemplateRepository();


//admin use cases
const createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);

const adminListChallengesUseCase = new ListAdminChallengesUseCase(challengeRepository);

const toggleChallengeStatusUseCase = new ToggleChallengeStatusUseCase(challengeRepository);

const addChallengeTagsUseCase =
    new AddChallengeTagsUseCase(
        challengeRepository,
        challengeTagRepository
    );

const getAvailableLanguagesUseCase = new GetAvailableLanguagesUseCase(programmingLanguageRepository);

const addChallengeLanguagesUseCase =
    new AddChallengeLanguagesUseCase(
        challengeRepository,
        programmingLanguageRepository
    );

const getChallengeLanguagesUseCase = new GetChallengeLanguagesUseCase(challengeRepository);

const addChallengeTestCasesUseCase = new AddChallengeTestCasesUseCase(challengeTestCaseRepository);

const addChallengeHintsUseCase = new AddChallengeHintsUseCase(challengeHintRepository);

const updateChallengeScheduleUseCase = new UpdateChallengeScheduleUseCase(challengeRepository);

const addChallengeCodeTemplatesUseCase = new AddChallengeCodeTemplatesUseCase(codeTemplateRepository);


//user
const userListChallengesUseCase = new ListChallengesUseCase(challengeRepository);

const getChallengeByIdUseCase = new GetChallengeByIdUseCase(challengeRepository);




// controller
export const challengeController = new ChallengeController(
    createChallengeUseCase,
    adminListChallengesUseCase,
    userListChallengesUseCase,
    toggleChallengeStatusUseCase,
    addChallengeTagsUseCase,
    getAvailableLanguagesUseCase,
    addChallengeLanguagesUseCase,
    getChallengeLanguagesUseCase,
    addChallengeTestCasesUseCase,
    addChallengeHintsUseCase,
    updateChallengeScheduleUseCase,
    addChallengeCodeTemplatesUseCase,

    getChallengeByIdUseCase
);

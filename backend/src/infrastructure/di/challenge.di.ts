import { ChallengeRepository } from "../repositories/challenge/ChallengeRepository";
import { ChallengeTagRepository } from "../repositories/challenge/ChallengeTagRepository";
import { ProgrammingLanguageRepository } from "../repositories/language/ProgrammingLanguageRepository";
import { ChallengeTestCaseRepository } from "../repositories/challenge/ChallengeTestCaseRepository";
import { ChallengeHintRepository } from "../repositories/challenge/ChallengeHintRepository";
import { ChallengeCodeTemplateRepository } from "../repositories/challenge/ChallengeCodeTemplateRepository";

import { CreateChallengeUseCase } from "../../application/use-cases/challenge/admin/createChallengeUseCase";
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

import { ListChallengesUseCase } from "../../application/use-cases/challenge/user/listChallengesUseCase";
import { GetChallengeByIdUseCase } from "../../application/use-cases/challenge/user/getChallengeByIdUseCase";
import { GetChallengeCodeTemplatesUseCase } from "../../application/use-cases/challenge/user/getChallengeCodeTemplatesUseCase";
import { GetChallengeHintsUseCase } from "../../application/use-cases/challenge/user/getChallengeHintsUseCase";
import { GetChallengeTestCasesUseCase } from "../../application/use-cases/challenge/user/getChallengeTestCasesUseCase";

import { ChallengeController } from "../../presentation/controllers/challenge.controller";

// repository
const challengeRepository = new ChallengeRepository();
const challengeTagRepository = new ChallengeTagRepository();
const programmingLanguageRepository = new ProgrammingLanguageRepository();
const challengeTestCaseRepository = new ChallengeTestCaseRepository();
const challengeHintRepository = new ChallengeHintRepository();
const challengeCodeTemplateRepository = new ChallengeCodeTemplateRepository();


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

const addChallengeCodeTemplatesUseCase = new AddChallengeCodeTemplatesUseCase(challengeCodeTemplateRepository);


//user
const userListChallengesUseCase = new ListChallengesUseCase(challengeRepository);

const getChallengeByIdUseCase = new GetChallengeByIdUseCase(challengeRepository);

const getChallengeCodeTemplatesUseCase = new GetChallengeCodeTemplatesUseCase(challengeCodeTemplateRepository);

const getChallengeHintsUseCase = new GetChallengeHintsUseCase(challengeHintRepository);
const getChallengeTestCasesUseCase = new GetChallengeTestCasesUseCase(challengeTestCaseRepository);



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

    getChallengeByIdUseCase,
    getChallengeCodeTemplatesUseCase,
    getChallengeHintsUseCase,
    getChallengeTestCasesUseCase
);

import { BadgeRepository } from "../repositories/badge/BadgeRepository";
import { GetBadgesUseCase } from "../../application/use-cases/badge/GetBadgesUseCase";
import { CreateBadgeUseCase } from "../../application/use-cases/badge/CreateBadgeUseCase";
import { BadgeController } from "../../presentation/controllers/badge.controller";

const badgeRepository = new BadgeRepository();

const getBadgesUseCase = new GetBadgesUseCase(badgeRepository);
const createBadgeUseCase = new CreateBadgeUseCase(badgeRepository);

const badgeController = new BadgeController(getBadgesUseCase, createBadgeUseCase);

export { badgeController };

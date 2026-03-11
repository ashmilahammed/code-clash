import { BadgeRepository } from "../repositories/badge/BadgeRepository";
import { CreateBadgeUseCase } from "../../application/use-cases/badge/CreateBadgeUseCase";
import { GetBadgesUseCase } from "../../application/use-cases/badge/GetBadgesUseCase";
import { UpdateBadgeUseCase } from "../../application/use-cases/badge/UpdateBadgeUseCase";
import { DeleteBadgeUseCase } from "../../application/use-cases/badge/DeleteBadgeUseCase";
import { BadgeController } from "../../presentation/controllers/badge.controller";
import { BadgeRewardService } from "../services/BadgeRewardService";
import { userRepository } from "./user.di";
import { notificationRepository } from "./notification.di";


// repository
export const badgeRepository = new BadgeRepository();

// services
export const badgeRewardService = new BadgeRewardService(
    badgeRepository,
    userRepository,
    notificationRepository
);

// use cases
const getBadgesUseCase = new GetBadgesUseCase(badgeRepository);
const createBadgeUseCase = new CreateBadgeUseCase(badgeRepository);
const updateBadgeUseCase = new UpdateBadgeUseCase(badgeRepository);
const deleteBadgeUseCase = new DeleteBadgeUseCase(badgeRepository)

//controller
export const badgeController = new BadgeController(
    getBadgesUseCase,
    createBadgeUseCase,
    updateBadgeUseCase,
    deleteBadgeUseCase
);

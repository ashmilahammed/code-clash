import { Badge } from "../../../domain/entities/badge/Badge";
import { IBadgeRepository } from "../../../domain/repositories/badge/IBadgeRepository";
import { CreateBadgeDTO } from "../../dto/badge/CreateBadgeDTO";

import { ICreateBadgeUseCase } from "../../interfaces/badge/ICreateBadgeUseCase";


export class CreateBadgeUseCase implements ICreateBadgeUseCase {
  constructor(
    private readonly _badgeRepository: IBadgeRepository
  ) {}

  async execute(dto: CreateBadgeDTO): Promise<Badge> {

    const badge = new Badge(
      undefined,
      dto.name,
      dto.description,
      dto.icon,
      dto.minXpRequired,
      dto.category,
      dto.requirementType,
      dto.requirementValue,
      true
    );

    return this._badgeRepository.create(badge);
  }
}
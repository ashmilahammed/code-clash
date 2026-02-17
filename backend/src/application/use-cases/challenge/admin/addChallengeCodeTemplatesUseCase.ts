import { ChallengeCodeTemplate } from "../../../../domain/entities/challenge/ChallengeCodeTemplate";
import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";


export class AddChallengeCodeTemplatesUseCase {
  constructor(
    private readonly _repo: IChallengeCodeTemplateRepository
  ) { }

  async execute(
    challengeId: string,
    templates: Omit<ChallengeCodeTemplate, "id" | "challengeId">[]
  ) {


    if (!templates.length) {
      throw new Error("CODE_TEMPLATES_REQUIRED");
    }

    const languages = new Set<string>();

    for (const t of templates) {
      if (!t.language) {
        throw new Error("LANGUAGE_REQUIRED");
      }

      if (!t.starterCode.trim()) {
        throw new Error("STARTER_CODE_REQUIRED");
      }

      if (!t.solutionCode.trim()) {
        throw new Error("SOLUTION_CODE_REQUIRED");
      }

      if (languages.has(t.language)) {
        throw new Error("DUPLICATE_LANGUAGE_TEMPLATE");
      }

      languages.add(t.language);
    }


    ////
    await this._repo.createMany(challengeId, templates);
  }
}

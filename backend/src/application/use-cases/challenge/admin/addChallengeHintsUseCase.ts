import { IChallengeHintRepository } from "../../../../domain/repositories/challenge/IChallengeHintRepository";


export class AddChallengeHintsUseCase {
  constructor(
    private readonly _repo: IChallengeHintRepository
  ) { }

  async execute(
    challengeId: string,
    hints: {
      order: number;
      content: string;
      unlockAfterMinutes?: number;
    }[]
  ): Promise<void> {

    if (!hints.length) return; // hints are optional

    const orders = new Set<number>();

    for (const h of hints) {
      if (!h.content.trim()) {
        throw new Error("HINT_CONTENT_REQUIRED");
      }

      if (orders.has(h.order)) {
        throw new Error("HINT_ORDER_DUPLICATE");
      }

      orders.add(h.order);

      if (
        h.unlockAfterMinutes !== undefined &&
        h.unlockAfterMinutes < 0
      ) {
        throw new Error("HINT_UNLOCK_TIME_INVALID");
      }
    }

    //
    await this._repo.createMany(challengeId, hints);
  }
}

import { IChallengeHintRepository } from "../../domain/repositories/IChallengeHintRepository";
import {
    ChallengeHintModel,
    // IChallengeHintDoc,
} from "../database/models/ChallengeHintModel";
import { IChallengeHint } from "../../domain/entities/ChallengeHint";


export class ChallengeHintRepository
    implements IChallengeHintRepository {

    async createMany(
        challengeId: string,
        hints: Omit<IChallengeHint, "id" | "challengeId">[]
    ): Promise<void> {
        await ChallengeHintModel.insertMany(
            hints.map((h) => ({
                ...h,
                challengeId,
            }))
        );
    }


    async findByChallenge(
        challengeId: string
    ): Promise<IChallengeHint[]> {
        const docs = await ChallengeHintModel
            .find({ challengeId })
            .sort({ order: 1 });


        return docs.map((d) => {
            const hint = {
                id: d._id.toString(),
                challengeId: d.challengeId.toString(),
                order: d.order,
                content: d.content,
            } as IChallengeHint;

            if (d.unlockAfterMinutes !== undefined) {
                hint.unlockAfterMinutes = d.unlockAfterMinutes;
            }

            return hint;
        });

    }
}

import { SubmissionModel } from "../../database/models/submission/SubmissionModel";
import { ISubmissionRepository } from "../../../domain/repositories/submission/ISubmissionRepository";
import { Submission } from "../../../domain/entities/submission/Submission";
import { Types } from "mongoose";


export class SubmissionRepository implements ISubmissionRepository {
  async create(submission: Submission): Promise<Submission> {
    const created = await SubmissionModel.create({
      userId: new Types.ObjectId(submission.userId),
      challengeId: new Types.ObjectId(submission.challengeId),
      language: submission.language,
      code: submission.code,
      finalStatus: submission.finalStatus,
      runtime: submission.runtime,
      memory: submission.memory,
      xpEarned: submission.xpEarned,
    });

    return new Submission(
      created._id.toString(),
      created.userId.toString(),
      created.challengeId.toString(),
      created.language,
      created.code,
      created.finalStatus,
      created.runtime,
      created.memory,
      created.xpEarned,
      created.submittedAt
    );
  }

  async findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<Submission[]> {
    const docs = await SubmissionModel.find({
      userId,
      challengeId,
    }).lean();

    return docs.map(
      (doc) =>
        new Submission(
          doc._id.toString(),
          doc.userId.toString(),
          doc.challengeId.toString(),
          doc.language,
          doc.code,
          doc.finalStatus,
          doc.runtime,
          doc.memory,
          doc.xpEarned,
          doc.submittedAt
        )
    );
  }

  async hasUserSolvedChallenge(
    userId: string,
    challengeId: string
  ): Promise<boolean> {
    const exists = await SubmissionModel.exists({
      userId,
      challengeId,
      finalStatus: "PASSED",
    });

    return !!exists;
  }

  async countSolved(userId: string): Promise<number> {
    // Count distinct challengeIds where status is PASSED
    const distinctChallenges = await SubmissionModel.distinct("challengeId", {
      userId,
      finalStatus: "PASSED",
    });
    return distinctChallenges.length;
  }
}

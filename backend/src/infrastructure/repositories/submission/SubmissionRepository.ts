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

  async getUserStats(userId: string): Promise<any> {
    const objectId = new Types.ObjectId(userId);

    const submissionStats = await SubmissionModel.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          passedSubmissions: {
            $sum: { $cond: [{ $eq: ["$finalStatus", "PASSED"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubmissions: 1,
          passedSubmissions: 1,
          acceptanceRate: {
            $cond: [
              { $eq: ["$totalSubmissions", 0] },
              0,
              { $multiply: [{ $divide: ["$passedSubmissions", "$totalSubmissions"] }, 100] }
            ]
          }
        }
      }
    ]);

    const difficultyStats = await SubmissionModel.aggregate([
      { $match: { userId: objectId, finalStatus: "PASSED" } },
      { $group: { _id: "$challengeId" } },
      {
        $lookup: {
          from: "challenges",
          localField: "_id",
          foreignField: "_id",
          as: "challenge"
        }
      },
      { $unwind: "$challenge" },
      {
        $group: {
          _id: "$challenge.difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    const languageStats = await SubmissionModel.aggregate([
      { $match: { userId: objectId, finalStatus: "PASSED" } },
      {
        $group: {
          // We group by both language and challengeId so if they solve the same challenge
          // multiple times in the same language, it counts as 1.
          _id: { language: "$language", challengeId: "$challengeId" }
        }
      },
      {
        $group: {
          _id: "$_id.language",
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = submissionStats[0] || { totalSubmissions: 0, passedSubmissions: 0, acceptanceRate: 0 };
    return {
      stats,
      // array of { difficulty: "easy", count: 10 }
      byDifficulty: difficultyStats.map(d => ({ difficulty: d._id, count: d.count })),
      byLanguage: languageStats.map(l => ({ language: l._id, count: l.count }))
    };
  }

  async getRecentActivity(userId: string, limit: number): Promise<any[]> {
    const objectId = new Types.ObjectId(userId);
    const activity = await SubmissionModel.aggregate([
      { $match: { userId: objectId } },
      { $sort: { submittedAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "challenges",
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge"
        }
      },
      { $unwind: "$challenge" },
      {
        $project: {
          _id: 1,
          challengeName: "$challenge.title",
          status: "$finalStatus",
          submittedAt: 1
        }
      }
    ]);

    return activity;
  }
}

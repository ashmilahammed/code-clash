import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";
import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { TransactionModel } from "../../database/models/admin/TransactionModel";
import { TransactionMapper } from "../../../application/mappers/TransactionMapper";

export class TransactionRepository implements ITransactionRepository {
    async create(transaction: Transaction): Promise<Transaction> {
        const persistenceData = TransactionMapper.toPersistence(transaction);
        const createdModel = await TransactionModel.create(persistenceData);
        return TransactionMapper.toDomain(createdModel);
    }

    async findAllWithDetails(): Promise<any[]> {
        const docs = await TransactionModel.find()
            .populate('userId', 'name email profileImage')
            .populate('planId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        return docs.map((doc: any) => ({
            id: doc._id.toString(),
            user: doc.userId ? {
                name: doc.userId.name,
                email: doc.userId.email,
                avatar: doc.userId.profileImage
            } : null,
            plan: doc.planId ? {
                name: doc.planId.name
            } : null,
            amount: doc.amount,
            paymentMethod: doc.paymentMethod,
            status: doc.status,
            date: doc.date || doc.createdAt
        }));
    }
}

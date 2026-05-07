import { Types } from "mongoose";
import { Transaction } from "../../domain/entities/transaction/Transaction";
import { ITransactionDoc } from "../../infrastructure/database/models/transactions/TransactionModel";

export class TransactionMapper {
    static toDomain(doc: ITransactionDoc): Transaction {
        return new Transaction(
            doc._id.toString(),
            doc.userId.toString(),
            doc.planId.toString(),
            doc.amount,
            doc.paymentMethod,
            doc.status,
            doc.date || doc.createdAt
        );
    }

    static toPersistence(transaction: Transaction): Partial<ITransactionDoc> {
        const payload: Partial<ITransactionDoc> = {
            userId: new Types.ObjectId(transaction.userId), // Cast for ObjectId conversion
            planId: new Types.ObjectId(transaction.planId),
            amount: transaction.amount,
            paymentMethod: transaction.paymentMethod,
            status: transaction.status
        };
        if (transaction.date) {
            payload.date = transaction.date;
        }
        return payload;
    }
}

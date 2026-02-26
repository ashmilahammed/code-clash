import { Transaction } from "../../domain/entities/transaction/Transaction";
import { ITransactionDoc } from "../../infrastructure/database/models/admin/TransactionModel";

export class TransactionMapper {
    static toDomain(doc: ITransactionDoc | any): Transaction {
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

    static toPersistence(transaction: Transaction) {
        const payload: any = {
            userId: transaction.userId,
            planId: transaction.planId,
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

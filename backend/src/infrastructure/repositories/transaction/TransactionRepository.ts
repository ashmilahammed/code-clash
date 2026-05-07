import { ITransactionRepository, IAdminTransactionDetail, IUserTransactionDetail } from "../../../domain/repositories/transaction/ITransactionRepository";
import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { TransactionModel } from "../../database/models/transactions/TransactionModel";
import { TransactionMapper } from "../../../application/mappers/TransactionMapper";


interface PopulatedAdminTransaction {
    _id: { toString(): string };
    userId: { name: string; email: string; profileImage?: string } | null;
    planId: { name: string } | null;
    amount: number;
    paymentMethod: string;
    status: string;
    date?: Date;
    createdAt: Date;
}

interface PopulatedUserTransaction {
    _id: { toString(): string };
    planId: {
        _id: { toString(): string };
        name: string;
        features: string[];
        duration: number;
        price: number;
    } | null;
    amount: number;
    paymentMethod: string;
    status: string;
    date?: Date;
    createdAt: Date;
}

export class TransactionRepository implements ITransactionRepository {
    
    async create(transaction: Transaction): Promise<Transaction> {
        const persistenceData = TransactionMapper.toPersistence(transaction);
        const createdModel = await TransactionModel.create(persistenceData);
        return TransactionMapper.toDomain(createdModel);
    }

    async findAllWithDetails(): Promise<IAdminTransactionDetail[]> {
        const docs = await TransactionModel.find()
            .populate('userId', 'name email profileImage')
            .populate('planId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        return (docs as unknown as PopulatedAdminTransaction[]).map((doc) => ({
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

    async findUserTransactions(userId: string, page: number, limit: number): Promise<{ data: IUserTransactionDetail[], total: number }> {
        const skip = (page - 1) * limit;
        
        const [docs, total] = await Promise.all([
            TransactionModel.find({ userId })
                .populate('planId', 'name features duration price')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            TransactionModel.countDocuments({ userId })
        ]);

        const data = (docs as unknown as PopulatedUserTransaction[]).map((doc) => {
            const planDoc = doc.planId;
            return {
                id: doc._id.toString(),
                plan: planDoc ? {
                    id: planDoc._id.toString(),
                    name: planDoc.name,
                    features: planDoc.features,
                    duration: planDoc.duration,
                    price: planDoc.price
                } : null,
                amount: doc.amount,
                paymentMethod: doc.paymentMethod,
                status: doc.status,
                date: doc.date || doc.createdAt
            };
        });

        return { data, total };
    }

    async findLatestSuccessfulTransaction(userId: string): Promise<IUserTransactionDetail | null> {
        const doc = await TransactionModel.findOne({ userId, status: 'Completed' })
            .populate('planId', 'name features duration price')
            .sort({ createdAt: -1 })
            .lean();

        if (!doc) return null;

        const populatedDoc = doc as unknown as PopulatedUserTransaction;
        const planDoc = populatedDoc.planId;

        return {
            id: populatedDoc._id.toString(),
            plan: planDoc ? {
                id: planDoc._id.toString(),
                name: planDoc.name,
                features: planDoc.features,
                duration: planDoc.duration,
                price: planDoc.price
            } : null,
            amount: populatedDoc.amount,
            paymentMethod: populatedDoc.paymentMethod,
            status: populatedDoc.status,
            date: populatedDoc.date || populatedDoc.createdAt
        };
    }
}

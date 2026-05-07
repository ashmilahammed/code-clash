import { Transaction } from "../../entities/transaction/Transaction";

export interface IAdminTransactionDetail {
    id: string;
    user: {
        name: string;
        email: string;
        avatar?: string | undefined;
    } | null;
    plan: {
        name: string;
    } | null;
    amount: number;
    paymentMethod: string;
    status: string;
    date: Date;
}

export interface IUserTransactionDetail {
    id: string;
    plan: {
        id?: string | undefined;
        name: string;
        features: string[];
        duration: number;
        price: number;
    } | null;
    amount: number;
    paymentMethod: string;
    status: string;
    date: Date;
}

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    findAllWithDetails(): Promise<IAdminTransactionDetail[]>;
    findUserTransactions(userId: string, page: number, limit: number): Promise<{ data: IUserTransactionDetail[], total: number }>;
    findLatestSuccessfulTransaction(userId: string): Promise<IUserTransactionDetail | null>;
}

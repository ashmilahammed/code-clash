import { Request, Response } from "express";
import { IGetTransactionsUseCase } from "../../application/interfaces/transaction/IGetTransactionsUseCase";
import { ICreateRazorpayOrderUseCase } from "../../application/interfaces/transaction/ICreateRazorpayOrderUseCase";
import { IVerifyRazorpayPaymentUseCase } from "../../application/interfaces/transaction/IVerifyRazorpayPaymentUseCase";
import { IGetUserTransactionsUseCase } from "../../application/interfaces/transaction/IGetUserTransactionsUseCase";
import { IGetCurrentPremiumPlanUseCase } from "../../application/interfaces/transaction/IGetCurrentPremiumPlanUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { CreateOrderDTO } from "../../application/dto/transaction/CreateOrderDTO";
import { VerifyPaymentDTO } from "../../application/dto/transaction/VerifyPaymentDTO";
import { GetUserTransactionsQueryDTO } from "../../application/dto/transaction/GetUserTransactionsQueryDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


interface AuthUserContext {
    userId: string;
    role: "user" | "admin";
}

export class TransactionController {
    constructor(
        private readonly _getTransactionsUseCase: IGetTransactionsUseCase,
        private readonly _createOrderUseCase: ICreateRazorpayOrderUseCase,
        private readonly _verifyPaymentUseCase: IVerifyRazorpayPaymentUseCase,
        private readonly _getUserTransactionsUseCase: IGetUserTransactionsUseCase,
        private readonly _getCurrentPremiumPlanUseCase: IGetCurrentPremiumPlanUseCase
    ) { }


    getTransactions = asyncHandler(async (req: Request, res: Response) => {
        const transactions = await this._getTransactionsUseCase.execute();

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, transactions));
    });


    getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user as AuthUserContext | undefined;

        if (!user) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const dto: GetUserTransactionsQueryDTO = {
            userId: user.userId,
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 10),
        };

        const result = await this._getUserTransactionsUseCase.execute(
            dto.userId,
            dto.page,
            dto.limit
        );

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));
    });


    getCurrentPlan = asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user as AuthUserContext | undefined;

        if (!user) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const plan = await this._getCurrentPremiumPlanUseCase.execute(user.userId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, plan));
    });


    createOrder = asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user as AuthUserContext | undefined;

        if (!user) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const { planId } = req.body;

        if (!planId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: CreateOrderDTO = {
            planId,
            userId: user.userId,
        };

        const order = await this._createOrderUseCase.execute(dto);

        res
            .status(HttpStatus.CREATED)
            .json(ApiResponse.success("Order created successfully", order));
    });



    verifyPayment = asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user as AuthUserContext | undefined;

        if (!user) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            planId,
        } = req.body;

        if (
            !razorpayOrderId ||
            !razorpayPaymentId ||
            !razorpaySignature ||
            !planId
        ) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: VerifyPaymentDTO = {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            planId,
            userId: user.userId,
        };

        const transaction = await this._verifyPaymentUseCase.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success("Payment verified successfully", transaction));
    });
}
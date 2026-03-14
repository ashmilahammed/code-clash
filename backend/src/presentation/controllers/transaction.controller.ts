import { Request, Response } from "express";
import { GetTransactionsUseCase } from "../../application/use-cases/transaction/GetTransactionsUseCase";
import { CreateRazorpayOrderUseCase } from "../../application/use-cases/transaction/CreateRazorpayOrderUseCase";
import { VerifyRazorpayPaymentUseCase } from "../../application/use-cases/transaction/VerifyRazorpayPaymentUseCase";
import { GetUserTransactionsUseCase } from "../../application/use-cases/transaction/GetUserTransactionsUseCase";
import { GetCurrentPremiumPlanUseCase } from "../../application/use-cases/transaction/GetCurrentPremiumPlanUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { CreateOrderDTO } from "../../application/dto/transaction/CreateOrderDTO";
import { VerifyPaymentDTO } from "../../application/dto/transaction/VerifyPaymentDTO";
import { GetUserTransactionsQueryDTO } from "../../application/dto/transaction/GetUserTransactionsQueryDTO";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}

export class TransactionController {
  constructor(
    private readonly _getTransactionsUseCase: GetTransactionsUseCase,
    private readonly _createOrderUseCase: CreateRazorpayOrderUseCase,
    private readonly _verifyPaymentUseCase: VerifyRazorpayPaymentUseCase,
    private readonly _getUserTransactionsUseCase: GetUserTransactionsUseCase,
    private readonly _getCurrentPremiumPlanUseCase: GetCurrentPremiumPlanUseCase
  ) {}


  getTransactions = async (req: Request, res: Response) => {
    try {
      const transactions = await this._getTransactionsUseCase.execute();

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, transactions));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };


  getMyTransactions = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
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

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, result));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };


  getCurrentPlan = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const plan = await this._getCurrentPremiumPlanUseCase.execute(user.userId);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, plan));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ApiResponse.error(message));
    }
  };


  createOrder = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
      }

      const { planId } = req.body;

      if (!planId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: CreateOrderDTO = {
        planId,
        userId: user.userId,
      };

      const order = await this._createOrderUseCase.execute(dto);

      return res
        .status(HttpStatus.CREATED)
        .json(ApiResponse.success("Order created successfully", order));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(message));
    }
  };

  

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user as AuthUserContext | undefined;

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
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
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
      }

      const dto: VerifyPaymentDTO = {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        planId,
        userId: user.userId,
      };

      const transaction = await this._verifyPaymentUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json(ApiResponse.success("Payment verified successfully", transaction));

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR;

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponse.error(message));
    }
  };
}
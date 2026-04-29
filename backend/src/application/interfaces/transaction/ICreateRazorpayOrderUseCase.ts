import { CreateOrderDTO } from "../../dto/transaction/CreateOrderDTO";

export interface ICreateRazorpayOrderUseCase {
  execute(dto: CreateOrderDTO): Promise<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }>;
}

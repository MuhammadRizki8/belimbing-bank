export interface DepositoTypeDto {
  id: number;
  name: string;
  yearlyReturn: number; // percent as number (e.g., 7.0)
}

export interface TransactionDto {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  transactionDate: string;
  accountId: number;
}

export interface AccountDto {
  id: number;
  balance: number;
  startDate?: string;
  customerId?: number;
  customer?: CustomerDto;
  depositoTypeId?: number;
  depositoType?: DepositoTypeDto;
  transactions?: TransactionDto[];
}

export interface CustomerDto {
  id: number;
  name: string;
  accounts?: AccountDto[];
  createdAt?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type { CustomerDto as Customer };

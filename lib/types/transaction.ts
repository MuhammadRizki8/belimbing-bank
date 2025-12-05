import type { AccountDto } from './account';

export interface TransactionDto {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  transactionDate: string;
  accountId: number;
  account?: AccountDto;
}

export type { TransactionDto as Transaction };

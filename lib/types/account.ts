import type { CustomerDto } from './customer';
import type { DepositoTypeDto } from './depositoType';
import type { TransactionDto } from './transaction';

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

export type { AccountDto as Account };

/**
 * DEPRECATED: `lib/models.ts`
 *
 * This file was moved to `lib/types/*` and is kept here as a backup
 * to preserve the original server models during migration. Do not
 * import this file in new code. Use `lib/types/customers.ts` for
 * client-facing DTOs and canonical types.
 */

export interface Customer {
  id: number;
  name: string;
  accounts?: Account[];
}

export interface DepositoType {
  id: number;
  name: string;
  yearlyReturn: number;
}

export interface Account {
  id: number;
  balance: number;
  customerId: number;
  customer: Customer;
  depositoTypeId: number;
  depositoType: DepositoType;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  date: string;
  accountId: number;
}

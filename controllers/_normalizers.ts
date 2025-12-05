import { CustomerDto, AccountDto, TransactionDto, DepositoTypeDto } from '@/lib/types/customers';

function decimalToNumber(value: any): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && typeof value.toNumber === 'function') return value.toNumber();
  return Number(value);
}

export function mapTransaction(t: any): TransactionDto {
  return {
    id: Number(t.id),
    amount: decimalToNumber(t.amount),
    type: t.type,
    transactionDate: t.transactionDate instanceof Date ? t.transactionDate.toISOString() : String(t.transactionDate),
    accountId: Number(t.accountId),
  };
}

export function mapDepositoType(d: any): DepositoTypeDto {
  return {
    id: Number(d.id),
    name: d.name,
    yearlyReturn: decimalToNumber(d.yearlyReturnRate ?? d.yearlyReturn),
  };
}

export function mapAccount(a: any): AccountDto {
  return {
    id: Number(a.id),
    balance: decimalToNumber(a.balance),
    startDate: a.startDate ? (a.startDate instanceof Date ? a.startDate.toISOString() : String(a.startDate)) : undefined,
    customerId: a.customerId != null ? Number(a.customerId) : undefined,
    depositoTypeId: a.depositoTypeId != null ? Number(a.depositoTypeId) : undefined,
    depositoType: a.depositoType ? mapDepositoType(a.depositoType) : undefined,
    transactions: Array.isArray(a.transactions) ? a.transactions.map(mapTransaction) : [],
  };
}

export function mapCustomer(c: any): CustomerDto {
  return {
    id: Number(c.id),
    name: c.name,
    accounts: Array.isArray(c.accounts) ? c.accounts.map(mapAccount) : [],
    createdAt: c.createdAt ? (c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt)) : undefined,
  };
}

export default {
  decimalToNumber,
  mapTransaction,
  mapDepositoType,
  mapAccount,
  mapCustomer,
};

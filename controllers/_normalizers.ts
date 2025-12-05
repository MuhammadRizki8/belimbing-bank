import type { AccountDto } from '@/lib/types/account';
import type { DepositoTypeDto } from '@/lib/types/depositoType';
import type { TransactionDto } from '@/lib/types/transaction';
import type { CustomerDto } from '@/lib/types/customer';

type AnyObj = Record<string, unknown>;
interface DecimalLike {
  toNumber(): number;
}

function decimalToNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null) {
    const obj = value as AnyObj;
    if ('toNumber' in obj && typeof (obj as unknown as DecimalLike).toNumber === 'function') {
      return (obj as unknown as DecimalLike).toNumber();
    }
  }
  const n = Number(value as unknown as number);
  return Number.isNaN(n) ? 0 : n;
}

export function mapTransaction(t: unknown): TransactionDto {
  const obj = t as AnyObj;
  return {
    id: Number(obj.id),
    amount: decimalToNumber(obj.amount),
    type: obj.type === 'DEPOSIT' || obj.type === 'WITHDRAW' ? (obj.type as 'DEPOSIT' | 'WITHDRAW') : 'DEPOSIT',
    transactionDate: obj.transactionDate instanceof Date ? obj.transactionDate.toISOString() : String(obj.transactionDate),
    accountId: Number(obj.accountId),
    account: obj.account ? mapAccount(obj.account) : undefined,
  };
}

export function mapDepositoType(d: unknown): DepositoTypeDto {
  const obj = d as AnyObj;
  return {
    id: Number(obj.id),
    name: String(obj.name),
    yearlyReturn: decimalToNumber(obj.yearlyReturnRate ?? obj.yearlyReturn),
  };
}

export function mapAccount(a: unknown): AccountDto {
  const obj = a as AnyObj;
  return {
    id: Number(obj.id),
    balance: decimalToNumber(obj.balance),
    startDate: obj.startDate ? (obj.startDate instanceof Date ? obj.startDate.toISOString() : String(obj.startDate)) : undefined,
    customerId: obj.customerId != null ? Number(obj.customerId) : undefined,
    depositoTypeId: obj.depositoTypeId != null ? Number(obj.depositoTypeId) : undefined,
    depositoType: obj.depositoType ? mapDepositoType(obj.depositoType) : undefined,
    transactions: Array.isArray(obj.transactions) ? obj.transactions.map(mapTransaction) : [],
  };
}

export function mapCustomer(c: unknown): CustomerDto {
  const obj = c as AnyObj;
  return {
    id: Number(obj.id),
    name: String(obj.name),
    accounts: Array.isArray(obj.accounts) ? obj.accounts.map(mapAccount) : [],
    createdAt: obj.createdAt ? (obj.createdAt instanceof Date ? obj.createdAt.toISOString() : String(obj.createdAt)) : undefined,
  };
}

const normalizers = {
  decimalToNumber,
  mapTransaction,
  mapDepositoType,
  mapAccount,
  mapCustomer,
};

export default normalizers;

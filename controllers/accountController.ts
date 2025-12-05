import prisma from '@/lib/prisma';

interface AccountUpdateData {
  customerId?: number;
  depositoTypeId?: number;
  balance?: number;
}

function decimalToNumber(value: any) {
  return value && typeof value === 'object' && typeof value.toNumber === 'function' ? value.toNumber() : value;
}

function normalizeAccount(a: any) {
  if (!a) return a;
  return {
    ...a,
    balance: decimalToNumber(a.balance),
    depositoType: a.depositoType
      ? (() => {
          const yr = decimalToNumber(a.depositoType.yearlyReturnRate);
          const copy = { ...a.depositoType, yearlyReturn: yr };
          delete (copy as any).yearlyReturnRate;
          return copy;
        })()
      : a.depositoType,
    transactions: Array.isArray(a.transactions) ? a.transactions.map((t: any) => ({ ...t, amount: decimalToNumber(t.amount) })) : a.transactions,
  };
}

export const AccountController = {
  async create(customerId: number, depositoTypeId: number, balance: number) {
    if (balance < 0) throw new Error('Initial balance cannot be negative');

    const acc = await prisma.account.create({
      data: {
        customerId,
        depositoTypeId,
        balance,
        startDate: new Date(),
      },
      include: { depositoType: true },
    });

    return normalizeAccount(acc);
  },

  async getById(id: number) {
    const acc = await prisma.account.findUnique({
      where: { id },
      include: {
        customer: true,
        depositoType: true,
        transactions: { orderBy: { transactionDate: 'desc' } },
      },
    });

    return normalizeAccount(acc);
  },

  async getAll() {
    const list = await prisma.account.findMany({ include: { customer: true, depositoType: true } });
    return list.map(normalizeAccount);
  },

  async update(id: number, data: AccountUpdateData) {
    const acc = await prisma.account.update({ where: { id }, data, include: { depositoType: true } });
    return normalizeAccount(acc);
  },

  async delete(id: number) {
    const acc = await prisma.account.delete({ where: { id }, include: { depositoType: true } });
    return normalizeAccount(acc);
  },
};

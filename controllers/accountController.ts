import prisma from '@/lib/prisma';

interface AccountUpdateData {
  customerId?: number;
  depositoTypeId?: number;
  balance?: number;
}

type AnyObj = Record<string, unknown>;

interface DecimalLike {
  toNumber(): number;
}

function decimalToNumber(value: unknown) {
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

function normalizeAccount(a: unknown) {
  const obj = a as AnyObj | null | undefined;
  if (!obj) return obj;
  return {
    ...obj,
    balance: decimalToNumber(obj.balance),
    depositoType: obj.depositoType
      ? (() => {
          const dt = obj.depositoType as AnyObj;
          const yr = decimalToNumber(dt.yearlyReturnRate ?? dt.yearlyReturn);
          const copy: AnyObj = { ...dt, yearlyReturn: yr };
          delete copy.yearlyReturnRate;
          return copy;
        })()
      : obj.depositoType,
    transactions: Array.isArray(obj.transactions) ? obj.transactions.map((t: unknown) => ({ ...(t as AnyObj), amount: decimalToNumber((t as AnyObj).amount) })) : obj.transactions,
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

  async getAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [list, total] = await Promise.all([
      prisma.account.findMany({
        skip,
        take,
        orderBy: { startDate: 'desc' },
        include: { customer: true, depositoType: true },
      }),
      prisma.account.count(),
    ]);

    const data = list.map(normalizeAccount);
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
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

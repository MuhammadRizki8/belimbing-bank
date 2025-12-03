import prisma from '@/lib/prisma';

export const AccountController = {
  async create(customerId: number, depositoTypeId: number, balance: number) {
    if (balance < 0) throw new Error('Initial balance cannot be negative');

    return await prisma.account.create({
      data: {
        customerId,
        depositoTypeId,
        balance,
        startDate: new Date(),
      },
    });
  },

  async getById(id: number) {
    return await prisma.account.findUnique({
      where: { id },
      include: {
        customer: true,
        depositoType: true,
        transactions: { orderBy: { transactionDate: 'desc' } },
      },
    });
  },

  async getAll() {
    return await prisma.account.findMany({ include: { customer: true, depositoType: true } });
  },
};

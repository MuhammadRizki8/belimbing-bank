import prisma from '@/lib/prisma';

export const CustomerController = {
  // Get all customers with their accounts
  async getAll() {
    return await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { accounts: true },
    });
  },

  // Create a customer
  async create(name: string) {
    if (!name) throw new Error('Name is required');
    return await prisma.customer.create({ data: { name } });
  },

  // Get customer detail
  async getById(id: number) {
    return await prisma.customer.findUnique({
      where: { id },
      include: { accounts: { include: { depositoType: true } } },
    });
  },

  // Delete customer (delete related transactions and accounts first)
  async delete(id: number) {
    const accounts = await prisma.account.findMany({ where: { customerId: id }, select: { id: true } });
    const accountIds = accounts.map((a) => a.id);

    if (accountIds.length > 0) {
      await prisma.transaction.deleteMany({ where: { accountId: { in: accountIds } } });
      await prisma.account.deleteMany({ where: { id: { in: accountIds } } });
    }

    return await prisma.customer.delete({ where: { id } });
  },
};

import prisma from '@/lib/prisma';
import { mapCustomer } from './_normalizers';

interface CustomerUpdateData {
  name?: string;
}

export const CustomerController = {
  // Get all customers
  async getAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [list, total] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          accounts: {
            include: {
              depositoType: true,
              transactions: { orderBy: { transactionDate: 'desc' } },
            },
          },
        },
      }),
      prisma.customer.count(),
    ]);

    // normalize and map to DTO using shared normalizer
    const data = list.map((c) => mapCustomer(c));
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

  // Update customer
  async update(id: number, data: CustomerUpdateData) {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  },

  // Delete customer (cascading delete is handled by the database)
  async delete(id: number) {
    return await prisma.customer.delete({
      where: { id },
    });
  },
};

import prisma from '@/lib/prisma';
import { subDays } from 'date-fns';
// Avoid importing model types directly from @prisma/client to prevent
// mismatches with the generated client. Infer the transaction item type
// from the runtime result below instead.

async function getStats(days: number = 7) {
  const requestTime = new Date();
  const totalCustomers = await prisma.customer.count();
  const totalAccounts = await prisma.account.count();

  const totalBalanceResult = await prisma.account.aggregate({
    _sum: {
      balance: true,
    },
  });
  const totalBalance = totalBalanceResult._sum.balance ?? 0;

  const sinceDate = subDays(new Date(), days);
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      transactionDate: {
        gte: sinceDate,
      },
    },
    orderBy: {
      transactionDate: 'asc',
    },
  });

  type TransactionTrendItem = { date: string; transactions: number };

  type RecentTransaction = (typeof recentTransactions)[number];

  const transactionTrend = recentTransactions.reduce((acc: TransactionTrendItem[], t: RecentTransaction) => {
    const date = t.transactionDate.toISOString().split('T')[0];
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.transactions++;
    } else {
      acc.push({ date, transactions: 1 });
    }
    return acc;
  }, [] as TransactionTrendItem[]);

  const accountDistributionData = await prisma.depositoType.findMany({
    include: {
      _count: {
        select: { accounts: true },
      },
    },
  });

  const accountDistribution = accountDistributionData
    .map((d) => ({
      name: d.name,
      value: d._count.accounts,
    }))
    .filter((d) => d.value > 0);

  return {
    metadata: {
      requestTime: requestTime.toISOString(),
      timeRangeDays: days,
    },
    stats: {
      totalCustomers,
      totalAccounts,
      totalBalance: Number(totalBalance),
      transactionTrend,
      accountDistribution,
    },
  };
}

export const StatsController = {
  getStats,
};

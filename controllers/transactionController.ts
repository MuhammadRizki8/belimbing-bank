import prisma from '@/lib/prisma';

export const TransactionController = {
  async deposit(accountId: number, amount: number, date: string) {
    if (amount <= 0) throw new Error('Deposit amount must be positive');

    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          accountId,
          amount,
          type: 'DEPOSIT',
          transactionDate: new Date(date),
        },
      });

      await tx.account.update({ where: { id: accountId }, data: { balance: { increment: amount } } });

      return transaction;
    });
  },

  async withdraw(accountId: number, amount: number, date: string) {
    const withdrawDate = new Date(date);

    const account = await prisma.account.findUnique({ where: { id: accountId }, include: { depositoType: true } });
    if (!account) throw new Error('Account not found');

    const currentBalance = Number(account.balance);
    const yearlyRate = Number(account.depositoType.yearlyReturnRate);

    const start = new Date(account.startDate);
    const monthsDiff = (withdrawDate.getFullYear() - start.getFullYear()) * 12 + (withdrawDate.getMonth() - start.getMonth());

    const monthlyReturnRate = yearlyRate / 100 / 12;

    const interestEarned = currentBalance * Math.max(0, monthsDiff) * monthlyReturnRate;
    const totalBalanceAvailable = currentBalance + interestEarned;

    if (amount > totalBalanceAvailable) {
      throw new Error(`Insufficient funds. Available (incl. interest): ${totalBalanceAvailable.toFixed(2)}`);
    }

    return await prisma.$transaction(async (tx) => {
      if (interestEarned > 0) {
        await tx.transaction.create({
          data: {
            accountId,
            amount: interestEarned,
            type: 'INTEREST',
            transactionDate: withdrawDate,
          },
        });
      }

      const trx = await tx.transaction.create({
        data: {
          accountId,
          amount,
          type: 'WITHDRAW',
          transactionDate: withdrawDate,
        },
      });

      const newBalance = totalBalanceAvailable - amount;
      await tx.account.update({ where: { id: accountId }, data: { balance: newBalance } });

      return { transaction: trx, interestEarned, totalBalanceBeforeWithdraw: totalBalanceAvailable };
    });
  },
};

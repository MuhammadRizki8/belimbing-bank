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

      // convert Decimal to number for amount
      const t = { ...transaction, amount: (transaction as any).amount && typeof (transaction as any).amount.toNumber === 'function' ? (transaction as any).amount.toNumber() : transaction.amount };
      return t;
    });
  },

  async withdraw(accountId: number, amount: number, date: string) {
    const withdrawDate = new Date(date);

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { depositoType: true, transactions: true },
    });
    if (!account) throw new Error('Account not found');

    if (account.balance.toNumber() < amount) {
      throw new Error('Insufficient funds');
    }

    // Correct Interest Calculation:
    // Calculate interest based on the initial deposit and time held.
    // This is a simplified example. A real-world scenario would be more complex.
    const deposit = account.transactions.find((t) => t.type === 'DEPOSIT' && t.amount.toNumber() > 0);
    const startingBalance = deposit ? deposit.amount.toNumber() : 0;
    const depositDate = deposit ? new Date(deposit.transactionDate) : new Date();

    const diffTime = Math.abs(withdrawDate.getTime() - depositDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const monthsHeld = diffDays / 30; // Approximation

    const yearlyReturn = account.depositoType.yearlyReturnRate.toNumber();
    const monthlyReturn = yearlyReturn / 12 / 100;

    // Simple interest calculation on the principal amount
    const interestEarned = startingBalance * monthsHeld * monthlyReturn;
    const endingBalance = account.balance.toNumber() + interestEarned;

    if (endingBalance < amount) {
      throw new Error(`Insufficient funds after interest calculation. You only have ${endingBalance.toFixed(2)}`);
    }

    const updatedBalance = endingBalance - amount;

    await prisma.transaction.create({
      data: {
        accountId,
        amount: -amount,
        type: 'WITHDRAW',
        transactionDate: withdrawDate,
      },
    });

    await prisma.account.update({
      where: { id: accountId },
      data: { balance: updatedBalance },
    });

    return {
      message: 'Withdrawal successful!',
      interestEarned,
      endingBalance,
      updatedBalance,
    };
  },
};

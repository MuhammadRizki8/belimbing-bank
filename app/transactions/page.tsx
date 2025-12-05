'use client';

import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TransactionsPageSkeleton from './_components/TransactionsPageSkeleton';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { cn } from '@/lib/utils';

// skeleton moved to `./_components/TransactionsPageSkeleton`

export default function TransactionsPage() {
  const { transactions, isLoading, isError } = useTransactions();

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-10">
        <TransactionsPageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container max-w-6xl mx-auto py-10 text-center text-rose-500">
        <p>Failed to load transaction data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{format(new Date(tx.transactionDate), 'PPP p')}</TableCell>
                  <TableCell>{tx.account?.customer?.name ?? 'N/A'}</TableCell>
                  <TableCell
                    className={cn({
                      'text-green-600': tx.type === 'DEPOSIT',
                      'text-red-600': tx.type === 'WITHDRAW',
                    })}
                  >
                    {tx.type}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Math.abs(tx.amount))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

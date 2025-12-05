'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { apiFetcher } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { AccountDto as Account } from '@/lib/types';

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  date: z.date(),
});

type TransactionType = 'DEPOSIT' | 'WITHDRAW';

import AccountDetailsPageSkeleton from './_components/AccountDetailsPageSkeleton';

export default function AccountDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [withdrawalResult, setWithdrawalResult] = useState<{ interestEarned: number; endingBalance: number; updatedBalance: number } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof formSchema>>,
    defaultValues: { amount: 0, date: new Date() },
  });
  async function fetchAccountDetails() {
    if (!id) return;
    try {
      const data = await apiFetcher(`/api/accounts/${id}`);
      setAccount(data as Account);
    } catch (err) {
      toast.error('Failed to fetch account details.');
      setAccount(null);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        if (!mounted) return;
        await fetchAccountDetails();
      } catch (err) {
        if (!mounted) return;
        toast.error('Failed to fetch account details.');
        setAccount(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const openDialog = (type: TransactionType) => {
    setTransactionType(type);
    form.reset({ amount: 0, date: new Date() });
    setWithdrawalResult(null);
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: transactionType,
          accountId: Number(id),
          amount: values.amount,
          date: values.date instanceof Date ? values.date.toISOString() : values.date,
        }),
      });

      const payload = await res.json();

      if (res.ok && payload?.success) {
        if (transactionType === 'WITHDRAW') {
          toast.success(payload.message || 'Withdrawal successful');
          setWithdrawalResult(payload.data || null);
        } else {
          toast.success('Deposit successful!');
          setIsDialogOpen(false);
        }
        await fetchAccountDetails();
      } else {
        toast.error(payload?.message || 'Transaction failed');
      }
    } catch (err) {
      toast.error('Transaction failed');
    }
  };

  if (!account) {
    return <AccountDetailsPageSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Manage transactions for {account.customer?.name ?? 'customer'}&apos;s account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Customer:</strong> {account.customer?.name ?? '—'}
            </div>
            {/* <div>
              <strong>Account ID:</strong> {account.id}
            </div> */}
            <div>
              <strong>Balance:</strong> ${Number(account.balance).toFixed(2)}
            </div>
            <div>
              <strong>Deposito Type:</strong> {account.depositoType ? `${account.depositoType.name} (${Number(account.depositoType.yearlyReturn).toFixed(2)}% yearly)` : '—'}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => openDialog('DEPOSIT')}>Deposit</Button>
            <Button variant="outline" onClick={() => openDialog('WITHDRAW')}>
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setWithdrawalResult(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{transactionType === 'DEPOSIT' ? 'Make a Deposit' : 'Make a Withdrawal'}</DialogTitle>
          </DialogHeader>
          {!withdrawalResult ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{transactionType === 'DEPOSIT' ? 'Deposit Date' : 'Withdrawal Date'}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={'outline'} className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Withdrawal Summary</h3>
              <p>
                <strong>Interest Earned:</strong> ${withdrawalResult.interestEarned.toFixed(2)}
              </p>
              <p>
                <strong>Balance Before Withdrawal:</strong> ${withdrawalResult.endingBalance.toFixed(2)}
              </p>
              <p>
                <strong>Final Account Balance:</strong> ${withdrawalResult.updatedBalance.toFixed(2)}
              </p>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(account.transactions ?? []).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className={tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}>{tx.type}</TableCell>
                  <TableCell>${Math.abs(Number(tx.amount)).toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(tx.transactionDate), 'PPP')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

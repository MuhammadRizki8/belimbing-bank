'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { AccountDto as Account, Customer as Customer } from '@/lib/types';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { useDepositoTypes } from '@/lib/hooks/useDepositoTypes';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import AccountPageSkeleton from './_components/AccountPageSkeleton';

const formSchema = z.object({
  customerId: z.string().min(1, 'Customer is required.'),
  depositoTypeId: z.string().min(1, 'Deposito Type is required.'),
  balance: z.coerce.number().positive('Balance must be a positive number.'),
});

// skeleton moved to `./_components/AccountPageSkeleton`

export default function AccountsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const { accounts, meta, isLoading, isError, mutate } = useAccounts(page, pageSize);
  const { customers } = useCustomers();
  const { depositoTypes } = useDepositoTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    // zodResolver has a slightly different inferred generic which can
    // cause a type incompatibility with react-hook-form's Resolver
    // types in some setups. Cast it to the correct Resolver type here
    // to satisfy TypeScript while keeping runtime validation.
    resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      customerId: '',
      depositoTypeId: '',
      balance: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    const method = editingAccount ? 'PUT' : 'POST';
    const url = editingAccount ? `/api/accounts/${editingAccount.id}` : '/api/accounts';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const payload = await res.json();
      if (res.ok && payload?.success) {
        toast.success(`Account ${editingAccount ? 'updated' : 'created'} successfully!`);
        await mutate();
        setIsDialogOpen(false);
        setEditingAccount(null);
        form.reset();
      } else {
        toast.error(payload?.message || 'Failed to save account');
      }
    } catch (err) {
      toast.error('Failed to save account');
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    form.setValue('customerId', String(account.customerId));
    form.setValue('depositoTypeId', String(account.depositoTypeId));
    form.setValue('balance', Number(account.balance));
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      const res = await fetch(`/api/accounts/${accountToDelete.id}`, { method: 'DELETE' });
      const payload = await res.json();
      if (res.ok && payload?.success) {
        toast.success('Account deleted successfully!');
        await mutate();
      } else {
        toast.error(payload?.message || 'Failed to delete account');
      }
    } catch (err) {
      toast.error('Failed to delete account');
    }

    setIsDeleteConfirmOpen(false);
    setAccountToDelete(null);
  };

  const openNewAccountDialog = () => {
    setEditingAccount(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <AccountPageSkeleton />
      </div>
    );
  }
  if (isError) return <div>Failed to load accounts.</div>;

  return (
    <div className="container  mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <Button onClick={openNewAccountDialog}>Add Account</Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAccount(null);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.map((customer: Customer) => (
                          <SelectItem key={customer.id} value={String(customer.id)}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depositoTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposito Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a deposito type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {depositoTypes?.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingAccount ? 'Save Changes' : 'Create Account'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description={`This will permanently delete this account and all its transactions.`}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Deposito Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(accounts) ? (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.customer?.name ?? '—'}</TableCell>
                <TableCell>{account.depositoType?.name ?? '—'}</TableCell>
                <TableCell>
                  {(() => {
                    const n = Number(account.balance);
                    if (Number.isFinite(n)) {
                      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
                    }
                    return String(account.balance);
                  })()}
                </TableCell>
                <TableCell>
                  <Link href={`/accounts/${account.id}`} passHref>
                    <Button variant="ghost" size="sm" className="mr-2">
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(account)} className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(account)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                {accounts == null ? 'No accounts available.' : 'Unexpected data format for accounts.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage(Math.max(1, page - 1))} />
            </PaginationItem>
            {[...Array(meta?.totalPages || 1)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(Math.min(meta?.totalPages || 1, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { CustomerDto as Customer, ApiListResponse } from '@/lib/types/customers';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import SearchBar from './_components/SearchBar';
import Pagination from './_components/Pagination';
import CustomerTable from './_components/CustomerTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

function CustomerPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 w-64" />
        <div className="ml-auto">
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="rounded-md border">
        {/* Table Skeleton */}
        <div className="w-full">
          {/* Header */}
          <div className="flex border-b">
            <div className="p-4 flex-1">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-4 w-32 text-right">
              <Skeleton className="h-5 w-16 ml-auto" />
            </div>
          </div>
          {/* Rows */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex border-b">
              <div className="p-4 flex-1">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-4 w-32 text-right">
                <Skeleton className="h-8 w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { customers, meta, isLoading, isError, mutate } = useCustomers(search, page, pageSize);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: { name: '' } });

  // reset page when filter changes
  const onSearchChange = useCallback((v: string) => {
    setPage(1);
    setSearch(v);
  }, []);

  const openNewCustomerDialog = useCallback(() => {
    setEditingCustomer(null);
    form.reset({ name: '' });
    setIsDialogOpen(true);
  }, [form]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const method = editingCustomer ? 'PUT' : 'POST';
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers';

      try {
        if (editingCustomer) {
          const resp = await apiClient.put<{ id: number }>(`/api/customers/${editingCustomer.id}`, values);
          if (resp?.success) {
            toast.success('Customer updated successfully!');
            await mutate();
            setIsDialogOpen(false);
            setEditingCustomer(null);
          } else {
            toast.error(resp?.message || 'Failed to update customer');
          }
        } else {
          const resp = await apiClient.post<{ id: number }>('/api/customers', values);
          if (resp?.success) {
            toast.success('Customer created successfully!');
            await mutate();
            setIsDialogOpen(false);
          } else {
            toast.error(resp?.message || 'Failed to create customer');
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err ?? '');
        toast.error(message || 'Failed to save customer');
      }
    },
    [editingCustomer, mutate]
  );

  const handleEdit = useCallback(
    (customer: Customer) => {
      setEditingCustomer(customer);
      form.setValue('name', customer.name);
      setIsDialogOpen(true);
    },
    [form]
  );

  const handleDeleteClick = useCallback((customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!customerToDelete) return;
    try {
      const resp = await apiClient.del<null>(`/api/customers/${customerToDelete.id}`);
      if (resp?.success) {
        toast.success('Customer deleted successfully!');
        await mutate();
      } else {
        toast.error(resp?.message || 'Failed to delete customer');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err ?? '');
      toast.error(message || 'Failed to delete customer');
    }
    setIsDeleteConfirmOpen(false);
    setCustomerToDelete(null);
  }, [customerToDelete, mutate]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <CustomerPageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container max-w-4xl mx-auto py-10 text-center text-rose-500">
        <p>Failed to load customer data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={openNewCustomerDialog}>Add Customer</Button>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <div className="w-64">
          <SearchBar value={search} onChange={onSearchChange} />
        </div>
        <div className="ml-auto">
          {!isLoading && !isError && meta && (
            <span className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </span>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingCustomer ? 'Save Changes' : 'Create Customer'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description={`This will permanently delete the customer "${customerToDelete?.name}" and all their associated accounts and transactions.`}
      />

      <CustomerTable customers={customers} onEdit={handleEdit} onDelete={handleDeleteClick} />

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{meta ? `Showing ${customers.length} of ${meta.total} customers` : ''}</div>
        {meta && <Pagination total={meta.total} page={meta.page} pageSize={meta.pageSize} onPageChange={setPage} />}
      </div>
    </div>
  );
}

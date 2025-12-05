'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import apiClient from '@/lib/api';
import { DepositoTypeDto as DepositoType } from '@/lib/types';
import { useDepositoTypes } from '@/lib/hooks/useDepositoTypes';
import DepositoTypesPageSkeleton from './_components/DepositoTypesPageSkeleton';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  yearlyReturn: z.coerce.number().positive('Yearly return must be a positive number.'),
});

// skeleton moved to `./_components/DepositoTypesPageSkeleton`

export default function DepositoTypesPage() {
  const { depositoTypes, isLoading, isError, mutate } = useDepositoTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingDepositoType, setEditingDepositoType] = useState<DepositoType | null>(null);
  const [depositoTypeToDelete, setDepositoTypeToDelete] = useState<DepositoType | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      name: '',
      yearlyReturn: 0,
    },
  });

  // data is loaded by `useDepositoTypes` hook (SWR). Use `mutate()` to revalidate.

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const method = editingDepositoType ? 'PUT' : 'POST';
    const url = editingDepositoType ? `/api/deposito-types/${editingDepositoType.id}` : '/api/deposito-types';
    try {
      if (editingDepositoType) {
        const resp = await apiClient.put(`/api/deposito-types/${editingDepositoType.id}`, values);
        if (resp?.success) {
          toast.success('Deposito Type updated successfully!');
          await mutate();
          setIsDialogOpen(false);
          setEditingDepositoType(null);
          form.reset();
        } else {
          toast.error(resp?.message || 'Failed to save deposito type');
        }
      } else {
        const resp = await apiClient.post('/api/deposito-types', values);
        if (resp?.success) {
          toast.success('Deposito Type created successfully!');
          await mutate();
          setIsDialogOpen(false);
          form.reset();
        } else {
          toast.error(resp?.message || 'Failed to save deposito type');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err ?? '');
      toast.error(message || 'Failed to save deposito type');
    }
  };

  const handleEdit = (type: DepositoType) => {
    setEditingDepositoType(type);
    form.reset({
      name: type.name,
      yearlyReturn: type.yearlyReturn,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (depositoType: DepositoType) => {
    setDepositoTypeToDelete(depositoType);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!depositoTypeToDelete) return;
    try {
      const resp = await apiClient.del(`/api/deposito-types/${depositoTypeToDelete.id}`);
      if (resp?.success) {
        toast.success('Deposito Type deleted successfully!');
        await mutate();
      } else {
        toast.error(resp?.message || 'Failed to delete deposito type');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err ?? '');
      toast.error(message || 'Failed to delete deposito type');
    }

    setIsDeleteConfirmOpen(false);
    setDepositoTypeToDelete(null);
  };

  const openNewDepositoTypeDialog = () => {
    setEditingDepositoType(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <DepositoTypesPageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 text-center text-rose-500">
        <p>Failed to load deposito types. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container  mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Deposito Types</h1>
        <Button onClick={openNewDepositoTypeDialog}>Add Deposito Type</Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingDepositoType(null);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepositoType ? 'Edit Deposito Type' : 'Add New Deposito Type'}</DialogTitle>
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
                      <Input placeholder="e.g., Bronze" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearlyReturn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Return (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingDepositoType ? 'Save Changes' : 'Create Type'}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description={`This will permanently delete the deposito type "${depositoTypeToDelete?.name}".`}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Yearly Return (%)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {depositoTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell>{type.name}</TableCell>
              <TableCell>{type.yearlyReturn}%</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(type)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(type)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

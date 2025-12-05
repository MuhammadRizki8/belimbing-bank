'use client';

import React from 'react';
import { CustomerDto as Customer } from '@/lib/types/customers';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

type Props = {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
};

function Row({ customer, onEdit, onDelete }: { customer: Customer; onEdit: (c: Customer) => void; onDelete: (c: Customer) => void }) {
  return (
    <TableRow>
      <TableCell>{customer.name}</TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => onEdit(customer)} className="mr-2">
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(customer)}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

const MemoRow = React.memo(Row);

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((c) => (
          <MemoRow key={c.id} customer={c} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  );
}

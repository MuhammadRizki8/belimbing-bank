'use client';

import React from 'react';
import { CustomerDto as Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

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
        {customer.accounts && customer.accounts.length > 0 ? (
          <div className="flex gap-2">
            {customer.accounts.slice(0, 3).map((a) => (
              <span key={a.id} title={a.depositoType?.name ?? `Account #${a.id}`} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                {a.depositoType?.name ? `${a.depositoType.name} • ${formatCurrency(a.balance ?? 0)}` : `${formatCurrency(a.balance ?? 0)}`}
              </span>
            ))}
            {customer.accounts.length > 3 && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">+{customer.accounts.length - 3}</span>}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
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

const MemoRow = React.memo(Row, (prev, next) => {
  const a = prev.customer;
  const b = next.customer;
  const accountsALen = a.accounts?.length ?? 0;
  const accountsBLen = b.accounts?.length ?? 0;
  const accountsSumA = (a.accounts ?? []).reduce((s, it) => s + (it.balance ?? 0), 0);
  const accountsSumB = (b.accounts ?? []).reduce((s, it) => s + (it.balance ?? 0), 0);
  return a.id === b.id && a.name === b.name && accountsALen === accountsBLen && accountsSumA === accountsSumB && prev.onEdit === next.onEdit && prev.onDelete === next.onDelete;
});

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Accounts</TableHead>
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

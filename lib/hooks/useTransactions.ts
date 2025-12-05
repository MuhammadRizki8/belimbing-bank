'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { apiFetcher } from '@/lib/api';
import { TransactionDto } from '@/lib/types';

export function useTransactions() {
  const { data, error, isLoading, mutate } = useSWR<TransactionDto[]>('/api/transactions', apiFetcher);

  const transactions = useMemo(() => {
    if (!data) return null;
    // The normalizer should handle this, but as a fallback, ensure amounts are numbers
    return data.map((tx) => ({ ...tx, amount: Number(tx.amount) }));
  }, [data]);

  return {
    transactions,
    isLoading,
    isError: error,
    mutate,
  };
}

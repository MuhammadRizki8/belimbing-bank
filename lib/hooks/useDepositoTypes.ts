import useSWR from 'swr';
import { DepositoTypeDto } from '@/lib/types';
import { apiFetcher } from '@/lib/api';

export function useDepositoTypes() {
  const { data, error, isLoading, mutate } = useSWR<DepositoTypeDto[]>('/api/deposito-types', apiFetcher);

  return {
    depositoTypes: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

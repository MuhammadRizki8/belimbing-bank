import useSWR from 'swr';
import { AccountDto } from '@/lib/types/customers';
import { apiFetcher } from '@/lib/api';

export function useAccounts() {
  const { data, error, isLoading, mutate } = useSWR<AccountDto[]>('/api/accounts', apiFetcher);

  return {
    accounts: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

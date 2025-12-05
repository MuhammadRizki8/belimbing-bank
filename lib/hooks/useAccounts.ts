import useSWR from 'swr';
import { AccountDto, ApiListResponse } from '@/lib/types';
import { apiFetcher } from '@/lib/api';

function toFinitePositiveInt(value: unknown, defaultValue: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : defaultValue;
}

export function useAccounts(page?: number, pageSize?: number) {
  const p = toFinitePositiveInt(page, 1);
  const ps = toFinitePositiveInt(pageSize, 10);

  const key = `/api/accounts?page=${p}&pageSize=${ps}`;

  const { data, error, isLoading, mutate } = useSWR<ApiListResponse<AccountDto>>(key, apiFetcher);

  return {
    response: data,
    accounts: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
}

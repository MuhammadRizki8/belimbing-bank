import useSWR from 'swr';
import { CustomerDto, ApiListResponse } from '@/lib/types';
import { apiFetcher } from '@/lib/api';

function toFinitePositiveInt(value: unknown, defaultValue: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : defaultValue;
}

export function useCustomers(page?: number, pageSize?: number) {
  const p = toFinitePositiveInt(page, 1);
  const ps = toFinitePositiveInt(pageSize, 10);

  const key = `/api/customers?page=${p}&pageSize=${ps}`;

  const { data, error, isLoading, mutate } = useSWR<ApiListResponse<CustomerDto>>(key, apiFetcher);

  return {
    response: data,
    customers: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
}

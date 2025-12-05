import useSWR from 'swr';
import { CustomerDto, ApiListResponse } from '@/lib/types/customers';
import { apiFetcher } from '@/lib/api';

export function useCustomers(search?: string, page: number = 1, pageSize: number = 8) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(search && { search }),
  });

  const { data, error, isLoading, mutate } = useSWR<ApiListResponse<CustomerDto>>(`/api/customers?${query.toString()}`, apiFetcher);

  return {
    response: data,
    customers: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
}

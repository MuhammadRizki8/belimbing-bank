'use client';

import useSWR from 'swr';
import apiClient from '@/lib/api';
import type { StatsResponse } from '@/lib/types/stats';

export function useStatistics(days: number) {
  const fetcher = (url: string) => apiClient.get<StatsResponse>(url);
  const { data, error, isLoading, mutate } = useSWR(() => `/api/stats?days=${days}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    stats: data?.stats,
    metadata: data?.metadata,
    error,
    isLoading,
    refetch: () => mutate(),
  } as const;
}

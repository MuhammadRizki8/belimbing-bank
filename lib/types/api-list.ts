export interface ApiListMeta {
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface ApiListResponse<T> {
  // canonical server response shape used across controllers
  data: T[];
  meta?: Partial<ApiListMeta>;

  // keep legacy fields for compatibility
  items?: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

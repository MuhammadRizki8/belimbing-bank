export interface CustomerDto {
  id: number;
  name: string;
  accounts?: import('./account').AccountDto[];
  createdAt?: string;
}

export type { CustomerDto as Customer };

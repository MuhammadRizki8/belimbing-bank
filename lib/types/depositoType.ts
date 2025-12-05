export interface DepositoTypeDto {
  id: number;
  name: string;
  /** numeric yearly return percentage (e.g. 3 for 3%) -- kept for compatibility */
  yearlyReturn: number;
  /** legacy/alternate name for the same value */
  interestRate?: number;
  termMonths?: number;
  createdAt?: string;
}

export type { DepositoTypeDto as DepositoType };

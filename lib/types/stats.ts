export interface TransactionTrendItem {
  date: string;
  transactions: number;
}

export interface AccountDistributionItem {
  name: string;
  value: number;
}

export interface Stats {
  totalCustomers: number;
  totalAccounts: number;
  totalBalance: number;
  transactionTrend: TransactionTrendItem[];
  accountDistribution: AccountDistributionItem[];
}

export interface Metadata {
  requestTime: string;
  timeRangeDays: number;
}

export interface StatsResponse {
  metadata: Metadata;
  stats: Stats;
}

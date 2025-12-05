export interface Customer {
  id: number;
  name: string;
  accounts?: Account[];
}

export interface DepositoType {
  id: number;
  name: string;
  yearlyReturn: number;
}

export interface Account {
  id: number;
  balance: number;
  customerId: number;
  customer: Customer;
  depositoTypeId: number;
  depositoType: DepositoType;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  date: string;
  accountId: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Filter {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}
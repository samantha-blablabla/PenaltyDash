export enum TransactionType {
  INCOME = 'INCOME', // Thu (e.g., Thu tiền phạt)
  EXPENSE = 'EXPENSE' // Chi (e.g., Nộp phạt, Chi phí liên quan)
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  status: 'completed' | 'pending';
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

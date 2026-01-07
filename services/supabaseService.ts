import { createClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Transaction } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';

// Initialize Supabase client
// Note: When deploying to Cloudflare Pages, set these variables in the Pages Dashboard -> Settings -> Environment Variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Fallback to mock mode if keys are missing
const isMockMode = !supabaseUrl || !supabaseKey;

if (isMockMode) {
  console.warn("Supabase keys not found. Running in MOCK mode.");
}

export const supabase = !isMockMode ? createClient(supabaseUrl, supabaseKey) : null;

export const transactionService = {
  // Fetch all transactions
  getAll: async (): Promise<Transaction[]> => {
    if (isMockMode || !supabase) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return a copy of mock data
      const stored = localStorage.getItem('mock_transactions');
      if (stored) return JSON.parse(stored);
      return [...MOCK_TRANSACTIONS];
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    return data as Transaction[];
  },

  // Add a new transaction
  add: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    if (isMockMode || !supabase) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTx = { ...transaction, id: Date.now().toString() };
      
      // Persist to local storage for mock mode so it feels real
      const current = await transactionService.getAll();
      const updated = [newTx, ...current];
      localStorage.setItem('mock_transactions', JSON.stringify(updated));
      
      return newTx;
    }

    // Remove ID if present, let DB generate it
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }

    return data as Transaction;
  },

  // Delete a transaction
  delete: async (id: string): Promise<void> => {
    if (isMockMode || !supabase) {
      const current = await transactionService.getAll();
      const updated = current.filter(t => t.id !== id);
      localStorage.setItem('mock_transactions', JSON.stringify(updated));
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
       console.error("Error deleting transaction:", error);
       throw error;
    }
  },

  // Subscribe to Realtime changes
  subscribe: (callback: (payload: RealtimePostgresChangesPayload<Transaction>) => void) => {
    if (isMockMode || !supabase) return { unsubscribe: () => {} };

    const channel = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
           // Type assertion needed because Supabase generic types can be loose here
           callback(payload as RealtimePostgresChangesPayload<Transaction>);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
};
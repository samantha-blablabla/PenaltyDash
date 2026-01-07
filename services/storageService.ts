import { Transaction } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../constants';

// Changed key to v2 to force a fresh start (clearing old mock data)
const STORAGE_KEY = 'penalty_dash_data_v2';
const CATEGORY_STORAGE_KEY = 'penalty_dash_categories_v1';
const BROADCAST_CHANNEL_NAME = 'penalty_dash_sync';

// Initialize Broadcast Channel for cross-tab sync
const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

export const transactionService = {
  // Fetch all transactions
  getAll: async (): Promise<Transaction[]> => {
    // Simulate slight delay for realism (optional)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with EMPTY array instead of mock data
      const initialData: Transaction[] = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(stored);
  },

  // Add a new transaction
  add: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    // Generate client-side ID
    const newTx: Transaction = { 
      ...transaction, 
      id: crypto.randomUUID(),
      // Ensure date is valid string
      date: transaction.date 
    };
    
    // Get current data
    const stored = localStorage.getItem(STORAGE_KEY);
    const currentData: Transaction[] = stored ? JSON.parse(stored) : [];
    
    // Add new to top
    const updatedData = [newTx, ...currentData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Notify other tabs
    channel.postMessage({ type: 'INSERT', payload: newTx });

    return newTx;
  },

  // Delete a transaction
  delete: async (id: string): Promise<void> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const currentData: Transaction[] = JSON.parse(stored);
    const updatedData = currentData.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Notify other tabs
    channel.postMessage({ type: 'DELETE', payload: { id } });
  },

  // Reset/Clear data
  reset: async () => {
    localStorage.removeItem(STORAGE_KEY);
    channel.postMessage({ type: 'RESET' });
  },

  // Subscribe to changes (simulating Realtime)
  subscribe: (callback: (event: { eventType: 'INSERT' | 'DELETE' | 'RESET', new?: Transaction, old?: {id: string} }) => void) => {
    
    const handler = (event: MessageEvent) => {
      const { type, payload } = event.data;
      
      if (type === 'INSERT') {
        callback({ eventType: 'INSERT', new: payload });
      } else if (type === 'DELETE') {
        callback({ eventType: 'DELETE', old: payload });
      } else if (type === 'RESET') {
        window.location.reload(); 
      }
    };

    channel.addEventListener('message', handler);

    return {
      unsubscribe: () => {
        channel.removeEventListener('message', handler);
      }
    };
  }
};

export const categoryService = {
  getAll: (): string[] => {
    const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
    const userCategories = stored ? JSON.parse(stored) : [];
    // Return unique categories (Defaults + User defined)
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...userCategories]));
  },

  add: (category: string) => {
    if (!category) return;
    const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
    const userCategories = stored ? JSON.parse(stored) : [];
    
    if (!userCategories.includes(category) && !DEFAULT_CATEGORIES.includes(category)) {
      const updated = [...userCategories, category];
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(updated));
    }
  }
};
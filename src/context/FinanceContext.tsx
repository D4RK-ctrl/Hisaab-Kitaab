import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Transaction, Category } from '../types';
import { 
  fetchTransactions, 
  saveTransaction, 
  updateTransaction as apiUpdateTransaction, 
  deleteTransaction as apiDeleteTransaction,
  fetchCategories,
  saveCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory
} from '../services/api';

// Define the state type
type FinanceState = {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
};

// Define the context type
type FinanceContextType = {
  state: FinanceState;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getBalance: () => { total: number; income: number; expense: number };
};

// Initial state
const initialState: FinanceState = {
  transactions: [],
  categories: [
    { id: '1', name: 'Salary', type: 'income', color: '#38B2AC' },
    { id: '2', name: 'Food', type: 'expense', color: '#F56565' },
    { id: '3', name: 'Transportation', type: 'expense', color: '#ED8936' },
    { id: '4', name: 'Entertainment', type: 'expense', color: '#9F7AEA' },
    { id: '5', name: 'Shopping', type: 'expense', color: '#4299E1' },
    { id: '6', name: 'Bills', type: 'expense', color: '#48BB78' },
    { id: '7', name: 'Freelance', type: 'income', color: '#805AD5' },
    { id: '8', name: 'Other', type: 'expense', color: '#A0AEC0' },
  ],
  loading: false,
  error: null,
};

// Create context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Action types
type FinanceAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer function
const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Check if Supabase is connected
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await fetchCategories();
        if (!error) {
          setIsSupabaseConnected(true);
        }
      } catch (error) {
        console.error('Supabase connection error:', error);
      }
    };

    checkSupabaseConnection();
  }, []);

  // Fetch transactions and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Fetch transactions
        const transactionsData = await fetchTransactions();
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsData });

        // Fetch categories if Supabase is connected
        if (isSupabaseConnected) {
          const categoriesData = await fetchCategories();
          if (categoriesData.length > 0) {
            dispatch({ type: 'SET_CATEGORIES', payload: categoriesData });
          } else {
            // If no categories exist in Supabase, use the default ones and save them
            for (const category of initialState.categories) {
              await saveCategory(category);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, [isSupabaseConnected]);

  // Add transaction
  const addTransaction = async (transaction: Transaction) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const savedTransaction = await saveTransaction(transaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: savedTransaction });
    } catch (error) {
      console.error('Failed to add transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add transaction' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update transaction
  const editTransaction = async (id: string, transaction: Transaction) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedTransaction = await apiUpdateTransaction(id, transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    } catch (error) {
      console.error('Failed to update transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update transaction' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await apiDeleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add category
  const addCategory = async (category: Category) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const savedCategory = await saveCategory(category);
      dispatch({ type: 'ADD_CATEGORY', payload: savedCategory });
    } catch (error) {
      console.error('Failed to add category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update category
  const updateCategory = async (id: string, category: Category) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedCategory = await apiUpdateCategory(id, category);
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
    } catch (error) {
      console.error('Failed to update category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await apiDeleteCategory(id);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Failed to delete category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Calculate balance
  const getBalance = () => {
    const income = state.transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = state.transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    return {
      total: income - expense,
      income,
      expense,
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        addTransaction,
        updateTransaction: editTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        getBalance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
import { supabase } from './supabaseClient';
import { Transaction, Category } from '../types';

// Fetch all transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    // Map from Supabase format to our app format
    return data.map(item => ({
      id: item.id,
      title: item.title,
      amount: item.amount,
      date: item.date,
      type: item.type,
      categoryId: item.category_id,
      description: item.description || undefined
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// Save a new transaction
export const saveTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category_id: transaction.categoryId,
      description: transaction.description || null,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    amount: data.amount,
    date: data.date,
    type: data.type,
    categoryId: data.category_id,
    description: data.description || undefined
  };
};

// Update an existing transaction
export const updateTransaction = async (id: string, transaction: Transaction): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      title: transaction.title,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category_id: transaction.categoryId,
      description: transaction.description || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    amount: data.amount,
    date: data.date,
    type: data.type,
    categoryId: data.category_id,
    description: data.description || undefined
  };
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      color: item.color
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Save a new category
export const saveCategory = async (category: Category): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving category:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    color: data.color
  };
};

// Update an existing category
export const updateCategory = async (id: string, category: Category): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      type: category.type,
      color: category.color
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    color: data.color
  };
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
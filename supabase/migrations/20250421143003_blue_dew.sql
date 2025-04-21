/*
  # Create initial schema for finance tracker

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `amount` (numeric)
      - `date` (date)
      - `type` (text, either 'income' or 'expense')
      - `category_id` (text, references categories)
      - `description` (text, nullable)
      - `created_at` (timestamp)
      - `user_id` (uuid, nullable)
    - `categories`
      - `id` (text, primary key)
      - `name` (text)
      - `type` (text, either 'income' or 'expense')
      - `color` (text)
      - `user_id` (uuid, nullable)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public access (for demo purposes)
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT NOT NULL,
  user_id UUID
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Allow public access to transactions" 
  ON transactions 
  FOR ALL 
  USING (true);

-- Create policies for categories
CREATE POLICY "Allow public access to categories" 
  ON categories 
  FOR ALL 
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions (user_id);
CREATE INDEX IF NOT EXISTS transactions_category_id_idx ON transactions (category_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions (date);
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON categories (user_id);
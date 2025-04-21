export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          title: string
          amount: number
          date: string
          type: 'income' | 'expense'
          category_id: string
          description: string | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          amount: number
          date: string
          type: 'income' | 'expense'
          category_id: string
          description?: string | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          date?: string
          type?: 'income' | 'expense'
          category_id?: string
          description?: string | null
          created_at?: string
          user_id?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: 'income' | 'expense'
          color: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          type: 'income' | 'expense'
          color: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'income' | 'expense'
          color?: string
          user_id?: string | null
        }
      }
    }
  }
}
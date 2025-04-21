import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import BalanceCard from '../components/BalanceCard';
import TransactionCard from '../components/TransactionCard';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const { state, addTransaction, deleteTransaction, getBalance } = useFinance();
  const { transactions, categories, loading } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { total, income, expense } = getBalance();

  // Get most recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id) || categories[categories.length - 1]; // fallback to 'Other'
  };

  const handleAddTransaction = async (transaction: any) => {
    await addTransaction(transaction);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="mb-8">
        <BalanceCard total={total} income={income} expense={expense} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Income</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-green-600">₹{income.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Expenses</h2>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-red-600">₹{expense.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Balance</h2>
            <Clock className="h-5 w-5 text-teal-500" />
          </div>
          <p className={`text-2xl font-semibold ${total >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
          ₹{total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">Recent Transactions</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                category={getCategoryById(transaction.categoryId)}
                onEdit={() => {}}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Start by adding your first transaction."
            actionLabel="Add Transaction"
            onAction={() => setIsModalOpen(true)}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transaction">
        <TransactionForm
          onSubmit={handleAddTransaction}
          categories={categories}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
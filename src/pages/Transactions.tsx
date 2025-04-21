import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import TransactionCard from '../components/TransactionCard';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import EmptyState from '../components/EmptyState';
import { Transaction, Filter } from '../types';

const Transactions = () => {
  const { state, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const { transactions, categories, loading } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>({});

  useEffect(() => {
    applyFilters(currentFilter);
  }, [transactions, currentFilter]);

  const applyFilters = (filter: Filter) => {
    let filtered = [...transactions];

    if (filter.type) {
      filtered = filtered.filter((t) => t.type === filter.type);
    }

    if (filter.categoryId) {
      filtered = filtered.filter((t) => t.categoryId === filter.categoryId);
    }

    if (filter.startDate) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filter.startDate!));
    }

    if (filter.endDate) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filter.endDate!));
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter((t) => 
        t.title.toLowerCase().includes(query) || 
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (filter: Filter) => {
    setCurrentFilter(filter);
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id) || categories[categories.length - 1];
  };

  const handleAddTransaction = async (transaction: Transaction) => {
    await addTransaction(transaction);
    setIsModalOpen(false);
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(undefined);
    }
    setIsModalOpen(false);
  };

  const openEditModal = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      <FilterBar categories={categories} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              category={getCategoryById(transaction.categoryId)}
              onEdit={openEditModal}
              onDelete={deleteTransaction}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No transactions found"
          description={
            Object.keys(currentFilter).some((key) => !!currentFilter[key as keyof Filter])
              ? "Try adjusting your filters to see more results."
              : "Start by adding your first transaction."
          }
          actionLabel="Add Transaction"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      >
        <TransactionForm
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
          categories={categories}
          initialData={editingTransaction}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Transactions;
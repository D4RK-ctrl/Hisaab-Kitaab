import React from 'react';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  total: number;
  income: number;
  expense: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ total, income, expense }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Current Balance</h2>
          <Wallet className="h-6 w-6 text-teal-100" />
        </div>
        <p className="text-3xl font-bold">₹{total.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-500">Income</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-green-600">+₹{income.toFixed(2)}</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-500">Expenses</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-red-600">-₹{expense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
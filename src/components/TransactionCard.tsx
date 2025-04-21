import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction, Category } from '../types';

interface TransactionCardProps {
  transaction: Transaction;
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  category,
  onEdit,
  onDelete,
}) => {
  const { id, title, amount, date, type, description } = transaction;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: category.color }}
          >
            <span className="text-sm font-medium">{category.name.substring(0, 1)}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <div className="flex items-center mt-1">
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">{format(new Date(date), 'PPP')}</span>
            </div>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-lg font-semibold ${
              type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {type === 'income' ? '+' : '-'}₹{amount.toFixed(2)}
          </span>
          <div className="flex space-x-1 mt-2">
            <button
              onClick={() => onEdit(id)}
              className="p-1 text-gray-400 hover:text-teal-600 rounded"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
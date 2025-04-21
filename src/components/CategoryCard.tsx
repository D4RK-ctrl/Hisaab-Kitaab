import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
            style={{ backgroundColor: category.color }}
          >
            <span className="text-xs font-medium">{category.name.substring(0, 1)}</span>
          </div>
          <span className="font-medium text-gray-800">{category.name}</span>
        </div>
        <div className="flex space-x-2 items-center">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {category.type}
          </span>
          <button
            onClick={() => onEdit(category.id)}
            className="p-1 text-gray-400 hover:text-teal-600 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
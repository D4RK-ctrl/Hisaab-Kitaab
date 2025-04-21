import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import CategoryCard from '../components/CategoryCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Category, TransactionType } from '../types';

const Categories = () => {
  const { state, addCategory, updateCategory, deleteCategory } = useFinance();
  const { categories } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<TransactionType | 'all'>('all');

  const filteredCategories = activeTab === 'all' 
    ? categories 
    : categories.filter(cat => cat.type === activeTab);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditingCategory(category);
      setIsModalOpen(true);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect transactions using this category.')) {
      deleteCategory(id).catch(error => {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. It may be in use by transactions.');
      });
    }
  };

  const handleSubmitCategory = (category: Category) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, category).catch(error => {
        console.error('Error updating category:', error);
      });
    } else {
      addCategory(category).catch(error => {
        console.error('Error adding category:', error);
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={handleAddCategory}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'income'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'expense'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('expense')}
          >
            Expense
          </button>
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No categories found"
          description="Add categories to better organize your transactions."
          actionLabel="Add Category"
          onAction={handleAddCategory}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <CategoryForm
          onSubmit={handleSubmitCategory}
          initialData={editingCategory}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

interface CategoryFormProps {
  onSubmit: (category: Category) => void;
  initialData?: Category | null;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: initialData?.name || '',
    type: initialData?.type || 'expense',
    color: initialData?.color || '#38B2AC',
  });

  const colorOptions = [
    '#38B2AC', // teal
    '#F56565', // red
    '#ED8936', // orange
    '#9F7AEA', // purple
    '#4299E1', // blue
    '#48BB78', // green
    '#805AD5', // indigo
    '#A0AEC0', // gray
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id || crypto.randomUUID(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          placeholder="Category name"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <div className="mt-1 flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700">Income</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-red-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700">Expense</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="grid grid-cols-8 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full ${
                formData.color === color ? 'ring-2 ring-offset-2 ring-teal-500' : ''
              }`}
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
        >
          {initialData ? 'Update' : 'Add'} Category
        </button>
      </div>
    </form>
  );
};

export default Categories;
import React, { useState } from 'react';
import { Filter as FilterIcon, Search, X } from 'lucide-react';
import { Filter, TransactionType, Category } from '../types';

interface FilterBarProps {
  categories: Category[];
  onFilterChange: (filter: Filter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>({
    type: undefined,
    categoryId: undefined,
    startDate: undefined,
    endDate: undefined,
    searchQuery: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilter = { ...filter, [name]: value === '' ? undefined : value };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  const handleTypeChange = (type: TransactionType | undefined) => {
    const updatedFilter = { ...filter, type };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    const updatedFilter = { ...filter, searchQuery: searchQuery || undefined };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  const resetFilters = () => {
    const resetFilter: Filter = {
      type: undefined,
      categoryId: undefined,
      startDate: undefined,
      endDate: undefined,
      searchQuery: '',
    };
    setFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const hasActiveFilters =
    filter.type !== undefined ||
    filter.categoryId !== undefined ||
    filter.startDate !== undefined ||
    filter.endDate !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filter.searchQuery || ''}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={toggleFilters}
            className={`ml-3 px-3 py-2 rounded-md flex items-center text-sm font-medium ${
              hasActiveFilters
                ? 'bg-teal-100 text-teal-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 flex items-center justify-center bg-teal-500 text-white text-xs rounded-full">
                !
              </span>
            )}
          </button>
        </div>

        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTypeChange(filter.type === 'income' ? undefined : 'income')}
                >
                  Income
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter.type === 'expense'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTypeChange(filter.type === 'expense' ? undefined : 'expense')}
                >
                  Expense
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={filter.categoryId || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filter.startDate || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filter.endDate || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex justify-end pt-2">
            <button
              onClick={resetFilters}
              className="flex items-center text-sm text-teal-600 hover:text-teal-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { state, getBalance } = useFinance();
  const { transactions, categories } = state;
  const [timeframe, setTimeframe] = useState('month');
  const [chartData, setChartData] = useState<any>({});
  const [categoryData, setCategoryData] = useState<any>({});
  
  useEffect(() => {
    if (transactions.length > 0) {
      generateChartData();
      generateCategoryData();
    }
  }, [transactions, timeframe]);

  const generateChartData = () => {
    const today = new Date();
    const startDate = timeframe === 'month' 
      ? subMonths(today, 5) 
      : timeframe === 'quarter' 
        ? subMonths(today, 11)
        : subMonths(today, 11);
        
    const months: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    
    let current = startDate;
    
    while (current <= today) {
      const monthStart = startOfMonth(current);
      const monthEnd = endOfMonth(current);
      
      const monthLabel = format(current, 'MMM yyyy');
      months.push(monthLabel);
      
      const monthTransactions = transactions.filter(t => {
        const transDate = new Date(t.date);
        return transDate >= monthStart && transDate <= monthEnd;
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthExpense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      incomeData.push(monthIncome);
      expenseData.push(monthExpense);
      
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }
    
    setChartData({
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(56, 178, 172, 0.6)',
          borderColor: 'rgba(56, 178, 172, 1)',
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(245, 101, 101, 0.6)',
          borderColor: 'rgba(245, 101, 101, 1)',
          borderWidth: 1,
        },
      ],
    });
  };
  
  const generateCategoryData = () => {
    const categoryTotals: Record<string, number> = {};
    const today = new Date();
    
    let startDate;
    if (timeframe === 'month') {
      startDate = startOfMonth(today);
    } else if (timeframe === 'quarter') {
      startDate = startOfMonth(subMonths(today, 2));
    } else {
      startDate = startOfMonth(subMonths(today, 11));
    }
    
    // Filter transactions for the selected timeframe
    const timeframeTransactions = transactions.filter(
      t => new Date(t.date) >= startDate && new Date(t.date) <= today
    );
    
    // Calculate totals by category for expenses
    const expenseTransactions = timeframeTransactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(transaction => {
      const { categoryId, amount } = transaction;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += amount;
    });
    
    // Prepare data for pie chart
    const categoryLabels = Object.keys(categoryTotals).map(
      catId => categories.find(c => c.id === catId)?.name || 'Unknown'
    );
    
    const categoryColors = Object.keys(categoryTotals).map(
      catId => categories.find(c => c.id === catId)?.color || '#A0AEC0'
    );
    
    const categoryAmounts = Object.values(categoryTotals);
    
    setCategoryData({
      labels: categoryLabels,
      datasets: [
        {
          data: categoryAmounts,
          backgroundColor: categoryColors,
          borderWidth: 1,
        },
      ],
    });
  };

  const { total, income, expense } = getBalance();
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeframe === 'month'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeframe === 'quarter'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeframe === 'year'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Balance</h2>
          <p className={`text-2xl font-semibold ${total >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
          ₹{total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Income</h2>
          <p className="text-2xl font-semibold text-green-600">₹{income.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Expenses</h2>
          <p className="text-2xl font-semibold text-red-600">₹{expense.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          {Object.keys(chartData).length > 0 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          {Object.keys(categoryData).length > 0 && categoryData.labels.length > 0 ? (
            <Pie data={categoryData} options={pieOptions} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
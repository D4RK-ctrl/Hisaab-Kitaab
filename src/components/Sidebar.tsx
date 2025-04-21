import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, WalletCards, BarChart3, Tags, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', to: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Transactions', to: '/transactions', icon: <WalletCards className="h-5 w-5" /> },
    { name: 'Categories', to: '/categories', icon: <Tags className="h-5 w-5" /> },
    { name: 'Analytics', to: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-teal-700 text-white">
      <div className="px-4 py-5">
        <div className="flex items-center">
          <WalletCards className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">FinanceTracker</h1>
        </div>
      </div>

      <nav className="flex-1 px-2 pb-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
                isActive
                  ? 'bg-teal-800 text-white'
                  : 'text-teal-100 hover:bg-teal-600 hover:text-white'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-teal-800">
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-teal-100 rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-150 ease-in-out">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
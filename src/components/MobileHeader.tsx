import React from 'react';
import { WalletCards, Menu } from 'lucide-react';

interface MobileHeaderProps {
  toggleMenu: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleMenu }) => {
  return (
    <div className="bg-teal-700 text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <WalletCards className="h-6 w-6 mr-2" />
        <h1 className="text-lg font-bold">FinanceTracker</h1>
      </div>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-teal-100 hover:text-white hover:bg-teal-600 focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MobileHeader;
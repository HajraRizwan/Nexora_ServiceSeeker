import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold" style={{ color: '#19034d' }}>
          Service Platform Admin
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#05f51d' }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
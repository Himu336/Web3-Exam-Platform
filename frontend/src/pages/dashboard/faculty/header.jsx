import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const Header = ({ activeSection }) => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">{activeSection}</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{currentUser?.username}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-sm font-medium text-green-700">
              {currentUser?.username?.charAt(0).toUpperCase() || 'F'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
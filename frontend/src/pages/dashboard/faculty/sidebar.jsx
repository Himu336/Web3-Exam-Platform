import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/faculty');
  };

  const menuItems = [
    { name: 'Question Bank', path: '/faculty/dashboard/question-bank' },
    { name: 'Create Question', path: '/faculty/dashboard/create-question' },
    { name: 'Results', path: '/faculty/dashboard/results' },
    { name: 'Profile', path: '/faculty/dashboard/profile' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6 flex flex-col h-full">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-blue-600">Web3 Exam Platform</h1>
          <p className="text-sm text-gray-500">Faculty Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                activeSection === item.name
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full text-left mt-8 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
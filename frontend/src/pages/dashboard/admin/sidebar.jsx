import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/admin');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Manage Users', icon: '👥' },
    { name: 'Manage Exams', icon: '📝' },
    { name: 'Manage Questions', icon: '❓' }
  ];

  return (
    <div className="w-64 bg-purple-900 text-white">
      <div className="p-6 flex flex-col h-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold">Web3 Exam Platform</h1>
          <p className="text-sm text-purple-300">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.name}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === item.name
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-200 hover:bg-purple-800'
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-2 text-sm text-purple-200 hover:bg-purple-800 rounded-lg flex items-center"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
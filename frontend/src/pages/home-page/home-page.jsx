import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const portalButtons = [
    { 
      title: 'Student', 
      description: 'Take exams and view your results',
      bgColor: 'bg-blue-600', 
      hoverColor: 'hover:bg-blue-700', 
      borderColor: 'border-blue-500',
      path: '/auth/student'
    },
    { 
      title: 'Faculty', 
      description: 'Create and manage exams',
      bgColor: 'bg-green-600', 
      hoverColor: 'hover:bg-green-700', 
      borderColor: 'border-green-500',
      path: '/auth/faculty'
    },
    { 
      title: 'Admin', 
      description: 'Manage users and system settings',
      bgColor: 'bg-purple-600', 
      hoverColor: 'hover:bg-purple-700', 
      borderColor: 'border-purple-500',
      path: '/auth/admin'
    }
  ];

  const handlePortalClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-12">Welcome to Web3 Exam Platform</h1>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {portalButtons.map(({ title, description, borderColor, path }) => (
            <button
              key={title}
              onClick={() => handlePortalClick(path)}
              className={`w-full p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300
                         border-t-4 ${borderColor} text-center group`}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {title} Portal
              </h2>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                {description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
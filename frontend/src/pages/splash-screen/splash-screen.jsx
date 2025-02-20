import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000); // Navigate to home after 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-32 h-32 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
        {/* Placeholder for logo */}
        <span className="text-4xl font-bold text-gray-400">Logo</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-800">Web3 Exam Platform</h1>
    </div>
  );
};

export default SplashScreen; 
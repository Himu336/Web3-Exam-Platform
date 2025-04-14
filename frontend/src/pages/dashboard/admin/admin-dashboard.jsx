import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Header from './header';
import Sidebar from './sidebar';
import Dashboard from './dashboard';
import ManageUsers from './manage-users';
import ManageExams from './manage-exams';
import ManageQuestions from './manage-questions';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If no user is found or user is not an admin, redirect to login
        if (!currentUser) {
          console.log('No user found, redirecting to login');
          navigate('/auth/admin');
          return;
        }

        if (currentUser.role !== 'admin') {
          console.log('User is not an admin, redirecting to login');
          navigate('/auth/admin');
          return;
        }

        console.log('Admin user verified:', currentUser.username);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin authentication:', error);
        navigate('/auth/admin');
      }
    };

    checkAuth();
  }, [currentUser, navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Manage Users':
        return <ManageUsers />;
      case 'Manage Exams':
        return <ManageExams />;
      case 'Manage Questions':
        return <ManageQuestions />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 
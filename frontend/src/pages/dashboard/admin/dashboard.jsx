import React, { useEffect } from 'react';
import { useUsers } from '../../../contexts/UserContext';

const Dashboard = () => {
  const { dashboardStats, loading, error, fetchDashboardStats } = useUsers();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Function to format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diff = (now - time) / 1000; // difference in seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading && !dashboardStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-600">
        <p>{error}</p>
        <p className="mt-2">There was an error loading dashboard data. This could be due to database connectivity issues.</p>
        <button 
          onClick={() => fetchDashboardStats()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare stats data for display
  const stats = dashboardStats?.stats || {
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalSessions: 0,
    roleCounts: {}
  };
  
  const recentActivity = dashboardStats?.recentActivity || [];

  const statsCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'bg-blue-500' },
    { label: 'Total Exams', value: stats.totalExams || 0, icon: '📝', color: 'bg-green-500' },
    { label: 'Questions', value: stats.totalQuestions || 0, icon: '❓', color: 'bg-yellow-500' },
    { label: 'Exam Sessions', value: stats.totalSessions || 0, icon: '🎓', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${stat.color} text-white flex items-center justify-center text-2xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users by Role */}
      {stats.roleCounts && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👨‍🎓</span>
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-xl font-bold">{stats.roleCounts.student || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👨‍🏫</span>
                <div>
                  <p className="text-sm text-gray-600">Faculty</p>
                  <p className="text-xl font-bold">{stats.roleCounts.faculty || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👨‍💼</span>
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-xl font-bold">{stats.roleCounts.admin || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="divide-y">
            {recentActivity.map((activity, index) => (
              <div key={index} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{activity.type}</span>
                  <span className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.name}
                  {activity.role && ` (${activity.role})`}
                  {activity.created_by && ` - by ${activity.created_by}`}
                  {activity.student_id && ` - by Student ID: ${activity.student_id}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activity found</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => {
              window.location.href = '/admin/dashboard';
              // Set activeSection to 'Manage Exams'
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Create New Exam
          </button>
          <button 
            onClick={() => {
              window.location.href = '/admin/dashboard';
              // Set activeSection to 'Manage Users'
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add New Faculty
          </button>
          <button 
            onClick={() => {
              window.location.href = '/admin/dashboard';
              // Set activeSection to 'Reports'
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            View Results
          </button>
          <button 
            onClick={() => {
              window.location.href = '/admin/dashboard';
              // Set activeSection to 'Manage Questions'
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
            Manage Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
import React, { useState, useEffect } from 'react';
import { useUsers } from '../../../contexts/UserContext';

const ManageUsers = () => {
  const { users, loading: globalLoading, error, fetchAllUsers, deleteUser } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const loadUsers = async () => {
      setInitialLoading(true);
      try {
        await fetchAllUsers();
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    // Apply filters and search
    let result = [...users];
    
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / usersPerPage));
    
    // Only reset to first page when filters change, not on every user data update
    if (roleFilter || statusFilter || searchQuery) {
      setCurrentPage(1);
    }
  }, [users, roleFilter, statusFilter, searchQuery]);

  const handleCreateUser = async () => {
    // Implement user creation modal or redirect to user creation page
    alert('Create user functionality to be implemented');
  };

  const handleEditUser = (userId) => {
    // Implement user edit modal or redirect to user edit page
    alert(`Edit user ${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current page of users
  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  };

  // True loading state only when we have no data yet
  const isLoading = initialLoading && users.length === 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-600">
        {error}
      </div>
    );
  }

  const currentUsers = getCurrentUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <button 
          onClick={handleCreateUser}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select 
          className="border rounded-md px-3 py-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admins</option>
        </select>
        <select 
          className="border rounded-md px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full border rounded-md px-3 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table - with fixed height to prevent layout shifts */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {globalLoading && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                </td>
              </tr>
            )}
            
            {!globalLoading && currentUsers.length > 0 && currentUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'faculty' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEditUser(user.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {!globalLoading && currentUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No users found matching the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * usersPerPage, filteredUsers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredUsers.length}</span> users
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            {/* Page numbers - limit displayed pages if there are too many */}
            {totalPages <= 7 ? (
              [...Array(totalPages).keys()].map(page => (
                <button 
                  key={page + 1}
                  onClick={() => handlePageChange(page + 1)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === page + 1 ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              ))
            ) : (
              <>
                {/* First page */}
                <button 
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === 1 ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                
                {/* Ellipsis for pages before current */}
                {currentPage > 3 && (
                  <span className="px-3 py-1">...</span>
                )}
                
                {/* Pages around current */}
                {[...Array(Math.min(3, totalPages)).keys()]
                  .map(i => {
                    // Calculate page numbers around current page
                    const page = Math.max(2, currentPage - 1) + i;
                    if (page > 1 && page < totalPages) {
                      return (
                        <button 
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 border rounded-md text-sm ${
                            currentPage === page ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  }).filter(Boolean)}
                
                {/* Ellipsis for pages after current */}
                {currentPage < totalPages - 2 && (
                  <span className="px-3 py-1">...</span>
                )}
                
                {/* Last page */}
                <button 
                  onClick={() => handlePageChange(totalPages)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === totalPages ? 'bg-purple-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers; 
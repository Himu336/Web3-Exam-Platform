import api from './api';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    return await api.get('/users');
  },

  // Get dashboard statistics (admin only)
  getDashboardStats: async () => {
    return await api.get('/users/stats');
  },

  // Get all faculty members (admin only)
  getAllFaculty: async () => {
    return await api.get('/users/faculty');
  },

  // Get all students (admin/faculty)
  getAllStudents: async () => {
    return await api.get('/users/students');
  },
  
  // Get user by ID (admin only)
  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  },
  
  // Create new user (admin only)
  createUser: async (userData) => {
    return await api.post('/users', userData);
  },
  
  // Update user (admin only)
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },
  
  // Delete user (admin only)
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  }
}; 
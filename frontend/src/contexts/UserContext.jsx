import React, { createContext, useContext, useState } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await userService.getDashboardStats();
      setDashboardStats(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFaculty = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllFaculty();
      setFaculty(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch faculty');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllStudents();
      setStudents(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id) => {
    setLoading(true);
    try {
      const response = await userService.getUserById(id);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await userService.createUser(userData);
      setUsers([...users, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const response = await userService.updateUser(id, userData);
      setUsers(users.map(user => user.id === id ? response.data : user));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    users,
    faculty,
    students,
    dashboardStats,
    loading,
    error,
    fetchAllUsers,
    fetchAllFaculty,
    fetchAllStudents,
    fetchDashboardStats,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = () => {
  return useContext(UserContext);
}; 
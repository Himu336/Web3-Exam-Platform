import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  // State for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for registration form visibility
  const [showRegister, setShowRegister] = useState(false);
  
  // Registration form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting admin login with:', { email });
      const result = await login(email, password);
      
      // Verify user is admin
      if (result.user.role !== 'admin') {
        setError('You do not have admin privileges');
        return;
      }
      
      console.log('Admin login successful, navigating to dashboard');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!regUsername || !regEmail || !regPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting admin registration with:', { email: regEmail, username: regUsername });
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: 'admin'
      });
      
      console.log('Admin registration successful, navigating to dashboard');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-700">
            {showRegister ? 'Admin Registration' : 'Admin Login'}
          </h1>
          <p className="mt-2 text-gray-600">
            {showRegister 
              ? 'Create a new administrator account' 
              : 'Sign in to access admin dashboard'}
          </p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {showRegister ? (
          // Registration Form
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div>
              <label htmlFor="regUsername" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="regUsername"
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="regEmail"
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="regPassword"
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="regConfirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="regConfirmPassword"
                type="password"
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? 'Processing...' : 'Register'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        ) : (
          // Login Form
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Need an admin account? Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;

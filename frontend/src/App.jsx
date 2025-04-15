import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QuestionProvider } from './contexts/QuestionContext';
import { ExamProvider } from './contexts/ExamContext';
import { ResultProvider } from './contexts/ResultContext';
import { UserProvider } from './contexts/UserContext';

import SplashScreen from './pages/splash-screen/splash-screen';
import HomePage from './pages/home-page/home-page';
import StudentLogin from './pages/auth-page/student-auth';
import FacultyLogin from './pages/auth-page/faculty-auth';
import AdminLogin from './pages/auth-page/admin-auth';
import StudentDashboard from './pages/dashboard/student/student-dashboard';
<<<<<<< HEAD
import ExamPage from './pages/exam-portal/exam-page'; // Import exam-page component
=======
import FacultyDashboard from './pages/dashboard/faculty/faculty-dashboard';
import AdminDashboard from './pages/dashboard/admin/admin-dashboard';
import NavigationBar from './components/navigation-bar';
import ExamScreen from './pages/exam-screen';
import ConfirmationPage from './pages/exam-screen/confirmation-page';
>>>>>>> main

// Protected Route Component for Faculty
const ProtectedFacultyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    return <Navigate to="/auth/faculty" />;
  }

  // Check if user is a faculty
  if (user.role !== 'faculty') {
    return <Navigate to="/" />;
  }

  return children;
};

// Protected Route Component for Student
const ProtectedStudentRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    return <Navigate to="/auth/student" />;
  }

  // Check if user is a student
  if (user.role !== 'student') {
    return <Navigate to="/" />;
  }

  return children;
};

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
  // Bypass authentication completely for a special URL parameter hack
  // This is just for development purposes
  const urlParams = new URLSearchParams(window.location.search);
  const devBypass = urlParams.get('dev_mode') === 'true';
  
  if (devBypass) {
    console.log('DEV BYPASS: Allowing direct access via URL parameter');
    
    // Create a mock admin user for the session if not already present
    if (!localStorage.getItem('user')) {
      const adminUser = {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@web3exam.com',
        role: 'admin'
      };
      localStorage.setItem('token', 'dev-admin-token');
      localStorage.setItem('user', JSON.stringify(adminUser));
    }
    
    return children;
  }
  
  // Special handling for development mode login
  const isDevelopmentUser = localStorage.getItem('token') === 'dev-admin-token';
  
  if (isDevelopmentUser) {
    try {
      // For development login, we only need to verify the user object
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('Development mode: No user data found');
        return <Navigate to="/auth/admin" />;
      }
      
      const user = JSON.parse(userStr);
      if (!user || user.role !== 'admin') {
        console.log('Development mode: Not an admin user');
        return <Navigate to="/" />;
      }
      
      console.log('Development mode admin access granted');
      return children;
    } catch (err) {
      console.error('Development mode: Error parsing user data', err);
      return <Navigate to="/auth/admin" />;
    }
  }
  
  // Normal authentication flow
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('Admin route protection: No token - redirecting to login');
    return <Navigate to="/auth/admin" />;
  }
  
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('Admin route protection: No user object in localStorage - redirecting to login');
      return <Navigate to="/auth/admin" />;
    }
    
    user = JSON.parse(userStr);
    console.log('Protected Admin Route - User data:', user);
    
    if (!user || user.role !== 'admin') {
      console.log(`Admin route protection: User role "${user?.role}" is not admin - redirecting to home`);
      return <Navigate to="/" />;
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/auth/admin" />;
  }

  console.log('Admin route protection: User is admin - allowing access');
  return children;
};

function App() {
  // When the app starts, check if there are any console errors and log them
  useEffect(() => {
    console.log('App mounted - checking authentication state');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('App starting with auth:', { token: !!token, user: !!user });
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <QuestionProvider>
          <ExamProvider>
            <ResultProvider>
              <Router>
                <div className="min-h-screen bg-slate-50">
                  <Routes>
                    {/* Routes that don't need the navigation bar */}
                    <Route path="/student/exam/:examId" element={<ExamScreen />} />
                    <Route path="/student/exam-confirmation/:examId" element={<ConfirmationPage />} />
                    
                    {/* Admin Dashboard Route - placed before the NavigationBar routes */}
                    <Route 
                      path="/admin/dashboard/*" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminDashboard />
                        </ProtectedAdminRoute>
                      } 
                    />
                    
                    {/* Routes with navigation bar */}
                    <Route
                      path="/*"
                      element={
                        <>
                          <NavigationBar />
                          <div className="pt-16">
                            <Routes>
                              <Route path="/" element={<SplashScreen />} />
                              <Route path="/home" element={<HomePage />} />
                              
                              {/* Auth Routes */}
                              <Route path="/auth/student" element={<StudentLogin />} />
                              <Route path="/auth/faculty" element={<FacultyLogin />} />
                              <Route path="/auth/admin" element={<AdminLogin />} />

<<<<<<< HEAD
        {/* Exam Page Route */}
        <Route path="/exam" element={<ExamPage />} />

        {/* Protected Student Dashboard Route */}
        <Route 
          path="/student/dashboard/*" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
=======
                              {/* Protected Student Dashboard Route */}
                              <Route 
                                path="/student/dashboard/*" 
                                element={
                                  <ProtectedStudentRoute>
                                    <StudentDashboard />
                                  </ProtectedStudentRoute>
                                } 
                              />
>>>>>>> main

                              {/* Protected Faculty Dashboard Route */}
                              <Route 
                                path="/faculty/dashboard/*" 
                                element={
                                  <ProtectedFacultyRoute>
                                    <FacultyDashboard />
                                  </ProtectedFacultyRoute>
                                } 
                              />

                              {/* Catch all route - redirect to home */}
                              <Route path="*" element={<Navigate to="/home" replace />} />
                            </Routes>
                          </div>
                        </>
                      }
                    />
                  </Routes>
                </div>
              </Router>
            </ResultProvider>
          </ExamProvider>
        </QuestionProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;

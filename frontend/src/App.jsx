import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/splash-screen/splash-screen';
import HomePage from './pages/home-page/home-page';
import StudentLogin from './pages/auth-page/student-auth';
import FacultyLogin from './pages/auth-page/faculty-auth';
import AdminLogin from './pages/auth-page/admin-auth';
import StudentDashboard from './pages/dashboard/student/student-dashboard';
import ExamPage from './pages/exam-portal/exam-page'; // Import exam-page component

// Protected Route Component
const ProtectedRoute = ({ children }) => {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route path="/auth/student" element={<StudentLogin />} />
        <Route path="/auth/faculty" element={<FacultyLogin />} />
        <Route path="/auth/admin" element={<AdminLogin />} />

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

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

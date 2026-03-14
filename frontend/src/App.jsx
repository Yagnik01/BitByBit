import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import PostProjectPage from './pages/postpage.jsx';
import Browse from './pages/browse.jsx';
import Freelancers from './pages/freelancer.jsx';
import MyProjects from './pages/MyProjects.jsx';
import Profile from './pages/Profile.jsx';
import LoginPage from './pages/login.jsx';
import SignupPage from './pages/signup.jsx';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });

  useEffect(() => {
    const stored = localStorage.getItem('authenticated') === 'true';
    if (stored !== isAuthenticated) {
      setIsAuthenticated(stored);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <SignupPage onSignup={handleSignup} />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/post-project"
          element={isAuthenticated ? <PostProjectPage /> : <Navigate to="/login" replace />}
        />
        <Route path="/browse" element={<Browse />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route
          path="/MyProjects"
          element={isAuthenticated ? <MyProjects /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/Profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

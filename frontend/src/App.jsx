  import React, { useEffect, useState } from 'react';
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import LandingPage from './pages/LandingPage';
  import HomePage from './pages/HomePage';
  import PostProjectPage from './pages/postpage.jsx';
  import Browse from './pages/browse.jsx';  
  import Freelancers from './pages/freelancer.jsx';
  import MyProjects from './pages/MyProjects.jsx';
  import Profile from './pages/Profile.jsx';
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

    const handleLogout = () => {
      localStorage.removeItem('authenticated');
      setIsAuthenticated(false);
    };

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/" replace />}
          />
          <Route path="/post-project" element={<PostProjectPage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/MyProjects" element={isAuthenticated ? <MyProjects /> : <Navigate to="/" replace />} />
          <Route path="/Profile" element={isAuthenticated ? <Profile /> : <Navigate to="/Profile" replace />} />
        </Routes>
      </BrowserRouter>
    );
  };

  export default App;

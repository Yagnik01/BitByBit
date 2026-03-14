import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { connectSocket, disconnectSocket } from "./socket";

import LandingPage       from "./pages/LandingPage";
import HomePage          from "./pages/HomePage";
import PostProjectPage   from "./pages/postpage.jsx";
import Browse            from "./pages/browse.jsx";
import Freelancers       from "./pages/freelancer.jsx";
import MyProjects        from "./pages/MyProjects.jsx";
import Profile           from "./pages/Profile.jsx";
import LoginPage         from "./pages/login.jsx";
import SignupPage        from "./pages/signup.jsx";
import ProjectDetails    from "./pages/ProjectDetails.jsx";
import ChatPage          from "./pages/ChatPage.jsx";
import MilestoneTracker  from "./pages/MilestoneTracker.jsx";
import SocketTest        from "./pages/SocketTest.jsx";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    const stored = localStorage.getItem("authenticated") === "true";
    if (stored !== isAuthenticated) setIsAuthenticated(stored);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const userStr = localStorage.getItem("user");
      const user    = userStr ? JSON.parse(userStr) : null;
      if (user?.id) connectSocket(user.id);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated]);

  const handleLogin  = () => setIsAuthenticated(true);
  const handleSignup = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    disconnectSocket();
    setIsAuthenticated(false);
  };

  const Protect = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/login"       element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <LoginPage  onLogin={handleLogin}/>} />
        <Route path="/signup"      element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <SignupPage onSignup={handleSignup}/>} />

        {/* Protected */}
        <Route path="/dashboard"             element={<Protect><HomePage onLogout={handleLogout}/></Protect>} />
        <Route path="/post-project"          element={<Protect><PostProjectPage/></Protect>} />
        <Route path="/MyProjects"            element={<Protect><MyProjects/></Protect>} />
        <Route path="/Profile"               element={<Protect><Profile/></Protect>} />
        <Route path="/chat"                  element={<Protect><ChatPage/></Protect>} />
        <Route path="/chat/:convId"          element={<Protect><ChatPage/></Protect>} />
        <Route path="/milestones/:projectId" element={<Protect><MilestoneTracker/></Protect>} />

        {/* Public */}
        <Route path="/browse"         element={<Browse/>} />
        <Route path="/freelancers"    element={<Freelancers/>} />
        <Route path="/project/:id"    element={<ProjectDetails/>} />
        <Route path="/socket-test"    element={<SocketTest/>} />

        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

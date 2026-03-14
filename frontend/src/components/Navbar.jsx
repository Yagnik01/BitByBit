import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onLogout }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    // Check if user is authenticated and get user info
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    const userId = localStorage.getItem('userId') || 'Yug0407'; // Fallback to username if no userId
    
    if (isAuthenticated && userId) {
      // Join user to their personal room for targeted notifications
      newSocket.emit('join_user_room', userId);
      
      // Load initial notifications
      newSocket.emit('get_notifications', userId);
    }

    // Listen for new project applications
    newSocket.on('freelancer_applied', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    newSocket.on('notifications_list', (data) => {
      setNotifications(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleConfirmFreelancer = (notification) => {
    if (socket) {
      socket.emit('confirm_freelancer', {
        projectId: notification.projectId,
        freelancerId: notification.freelancerId
      });
      
      // Remove notification from list
      setNotifications(prev => 
        prev.filter(n => n.projectId !== notification.projectId || n.freelancerId !== notification.freelancerId)
      );
      
      alert(`Confirmed ${notification.freelancerName} for project: ${notification.projectTitle}`);
    }
  };

  const handleRejectFreelancer = (notification) => {
    if (socket) {
      socket.emit('reject_freelancer', {
        projectId: notification.projectId,
        freelancerId: notification.freelancerId
      });
      
      // Remove notification from list
      setNotifications(prev => 
        prev.filter(n => n.projectId !== notification.projectId || n.freelancerId !== notification.freelancerId)
      );
      
      alert(`Rejected ${notification.freelancerName} for project: ${notification.projectTitle}`);
    }
  };
  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <div className="navbar__start">
            <a className="navbar__logo" href="#">
              <img
                src="https://www.freelancer.com/assets/main/en/assets/freelancer-logo-light.svg"
                alt="Freelancer"
              />
            </a>
            <nav className="navbar__menu">
              <a href="#" className="navbar__link is-active">Dashboard</a>
              <a href="/browse" className="navbar__link">Lists</a>
              <a href="/freelancers" className="navbar__link">FreeLancers</a>
              <a href="/MyProjects" className="navbar__link">My Projects</a>
              <a href="#" className="navbar__link">Feedback</a>
              <a href="#" className="navbar__link">Project Updates</a>
            </nav>
          </div>

          {/* <div className="navbar__center">
            <div className="navbar__section">
              
            </div>
          </div> */}

          <div className="navbar__end">
            <Link to="/post-project" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Post a Project
            </Link>
            <NotificationDropdown 
              notifications={notifications}
              onConfirmFreelancer={handleConfirmFreelancer}
              onRejectFreelancer={handleRejectFreelancer}
            />
            <div className="icon-btn" title="Messages">
              💬
              <span className="badge">1</span>
            </div>
            <div className="user-chip">
              <img
                src="https://www.freelancer.com/img/unknown.png?image-optimizer=force&format=webply&width=120"
                alt="Avatar"
              />
              <Link to="/Profile" className="username">
    @Yug0407
  </Link>
              <strong>₹0.00 INR</strong>
            </div>
            <button onClick={onLogout} className="btn outline" style={{ marginLeft: '0.75rem' }}>
              Log Out
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

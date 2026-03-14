import React, { useState } from 'react';
import './NotificationDropdown.css';

const NotificationDropdown = ({ notifications, onConfirmFreelancer, onRejectFreelancer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = (notification) => {
    onConfirmFreelancer(notification);
    setIsOpen(false);
  };

  const handleReject = (notification) => {
    onRejectFreelancer(notification);
    setIsOpen(false);
  };

  return (
    <div className="notification-dropdown">
      <div className="icon-btn" title="Notifications" onClick={() => setIsOpen(!isOpen)}>
        🔔
        <span className="badge">{notifications.length}</span>
      </div>
      
      {isOpen && (
        <div className="notification-menu">
          <div className="notification-header">
            <h3>Project Applications</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No new applications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-content">
                    <div className="freelancer-info">
                      <img 
                        src={notification.freelancerAvatar || "https://www.freelancer.com/img/unknown.png?image-optimizer=force&format=webply&width=120"} 
                        alt="Freelancer" 
                        className="freelancer-avatar"
                      />
                      <div className="freelancer-details">
                        <strong>{notification.freelancerName}</strong>
                        <p>applied for: {notification.projectTitle}</p>
                        <small>{new Date(notification.timestamp).toLocaleString()}</small>
                      </div>
                    </div>
                    
                    <div className="notification-actions">
                      <button 
                        className="confirm-btn"
                        onClick={() => handleConfirm(notification)}
                      >
                        Confirm
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleReject(notification)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

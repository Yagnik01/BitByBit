import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <div className="navbar__start">
            <a className="navbar__logo" href="/dashboard">
              <img
                src="https://www.freelancer.com/assets/main/en/assets/freelancer-logo-light.svg"
                alt="Freelancer"
              />
            </a>
            <nav className="navbar__menu">
              <Link to="/dashboard" className="navbar__link is-active">Dashboard</Link>
              <Link to="/browse" className="navbar__link">Browse Projects</Link>
              <Link to="/freelancers" className="navbar__link">FreeLancers</Link>
              <Link to="/MyProjects" className="navbar__link">My Projects</Link>
            </nav>
          </div>

          <div className="navbar__end">
            <Link to="/post-project" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Post a Project
            </Link>
            <div className="icon-btn" title="Notifications">
              🔔
              <span className="badge">2</span>
            </div>
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
                @{user?.name || 'User'}
              </Link>
            </div>
            <button onClick={handleLogout} className="btn outline" style={{ marginLeft: '0.75rem' }}>
              Log Out
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

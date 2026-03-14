import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
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

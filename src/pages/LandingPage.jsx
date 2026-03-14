import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const openAuthModal = (tab = 'login') => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setIsLoading(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup' && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    localStorage.setItem('authenticated', 'true');
    setIsLoading(false);
    closeModal();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-left">
          <a href="/" className="landing-brand">
            <svg className="brand-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="brand-text">freelancer</span>
          </a>
          <nav className="nav-menu">
            <button type="button" className="nav-item">
              Hire freelancers <span className="nav-arrow">▼</span>
            </button>
            <button type="button" className="nav-item">
              Find work <span className="nav-arrow">▼</span>
            </button>
            <button type="button" className="nav-item">
              Solutions <span className="nav-arrow">▼</span>
            </button>
          </nav>
        </div>
        <div className="header-right">
          <button type="button" className="header-link" onClick={() => openAuthModal('login')}>
            Log In
          </button>
          <button type="button" className="header-link" onClick={() => openAuthModal('signup')}>
            Sign Up
          </button>
          <Link to="/post-project" className="btn-primary" style={{ textDecoration: 'none' }}>
            Post a Project
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <video
          className="hero-video"
          playsInline
          autoPlay
          muted
          loop
          src="https://www.f-cdn.com/assets/main/en/assets/home/video/nasa-v3.mp4"
        />
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <h1>Hire the best freelancers for any job, online.</h1>
          <ul className="hero-features">
            <li>World's largest freelance marketplace</li>
            <li>Any job you can possibly think of</li>
            <li>Save up to 90% & get quotes for free</li>
            <li>Pay only when you're 100% happy</li>
          </ul>
          <div className="hero-buttons">
            <button type="button" className="btn-hire" onClick={() => openAuthModal('signup')}>
              Hire a Freelancer
            </button>
            <button type="button" className="btn-earn" onClick={() => openAuthModal('signup')}>
              Earn Money Freelancing
            </button>
          </div>
        </div>

        <div className="pink-arrow" />
        <p className="hero-caption">
          This radiation shield design for NASA cost $500 USD and took 15 days
        </p>
      </section>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="auth-modal-overlay" onClick={closeModal}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-header">
              <h3>{activeTab === 'signup' ? 'Create Account' : 'Welcome Back'}</h3>
              <button type="button" className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <p className="auth-subtitle">
              {activeTab === 'signup'
                ? 'Join millions of freelancers and clients'
                : 'Sign in to access your dashboard'}
            </p>

            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {activeTab === 'signup' && (
                <label>
                  Full Name
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </label>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="submit"
                className={`btn-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? '' : activeTab === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="auth-switch">
              {activeTab === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('login')}>
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('signup')}>
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
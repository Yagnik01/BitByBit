import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

    setIsLoading(false);
    if (onLogin) onLogin();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="landing-page">
      <section className="hero-section" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="hero-overlay" />
        <div className="auth-modal" style={{ position: 'relative', zIndex: 2 }}>
          <div className="auth-header">
            <h3>Welcome Back</h3>
          </div>
          <p className="auth-subtitle">Sign in to access your dashboard</p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
              {isLoading ? '' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
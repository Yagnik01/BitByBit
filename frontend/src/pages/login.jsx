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

    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.trim().length < 6) { setError('Password must be at least 6 characters.'); return; }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login failed.'); setIsLoading(false); return; }

      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (onLogin) onLogin();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Server error. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="landing-page">
      <section className="hero-section" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="hero-overlay" />
        <div className="auth-modal" style={{ position: 'relative', zIndex: 2 }}>
          <div className="auth-header"><h3>Welcome Back</h3></div>
          <p className="auth-subtitle">Sign in to access your dashboard</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </label>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className={`btn-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? '' : 'Sign In'}
            </button>
          </form>
          <div className="auth-switch">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;

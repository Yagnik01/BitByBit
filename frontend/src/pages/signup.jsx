import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {budget} from "./postpage.jsx"
const SignupPage = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsLoading(false);
    if (onSignup) onSignup();
    localStorage.setItem('authenticated', 'true');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="landing-page">
      <section className="hero-section" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="hero-overlay" />
        <div className="auth-modal" style={{ position: 'relative', zIndex: 2 }}>
          <div className="auth-header">
            <h3>Create Account</h3>
          </div>
          <p className="auth-subtitle">Join millions of freelancers and clients</p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? '' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
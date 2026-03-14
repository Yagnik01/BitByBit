import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

    if (name.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.trim().length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsLoading(true);
    try {
      // Step 1: Register
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) { setError(signupData.message || 'Signup failed.'); setIsLoading(false); return; }

      // Step 2: Auto login after signup
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) { setError('Account created. Please login.'); setIsLoading(false); navigate('/login'); return; }

      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      if (onSignup) onSignup();
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
          <div className="auth-header"><h3>Create Account</h3></div>
          <p className="auth-subtitle">Join millions of freelancers and clients</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </label>
            <label>Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </label>
            <label>Confirm Password
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </label>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className={`btn-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? '' : 'Create Account'}
            </button>
          </form>
          <div className="auth-switch">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Welcome back 👋</h1>
        <p className="subtitle">Sign in to continue practising</p>
        {error && <p style={{ color: 'var(--red)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input id="login-email" className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input id="login-password" className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button id="login-submit" className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <hr className="divider" />
        <p className="text-center text-muted">
          No account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

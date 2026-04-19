import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Create account ✨</h1>
        <p className="subtitle">Start your aptitude journey today</p>
        {error && <p style={{ color: 'var(--red)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input id="reg-name" className="input" type="text" placeholder="John Doe" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input id="reg-email" className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input id="reg-password" className="input" type="password" placeholder="min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button id="reg-submit" className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <hr className="divider" />
        <p className="text-center text-muted">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

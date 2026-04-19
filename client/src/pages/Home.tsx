import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Quant', 'Logical', 'Verbal'];
const DIFFICULTIES = ['All', 'easy', 'medium', 'hard'];
const LIMITS = [5, 10, 15, 20];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [limit, setLimit] = useState(10);

  const start = (mode: 'practice' | 'test') => {
    const params = new URLSearchParams({ category, difficulty, limit: String(limit), mode });
    navigate(`/${mode}?${params.toString()}`);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page" style={{ justifyContent: 'flex-start', paddingTop: '3rem' }}>
        <div className="card card-wide">
          <h1 className="title">Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="subtitle">Choose your session settings and start practising</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="label">Category</label>
              <select id="cat-select" className="select" style={{ width: '100%' }} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select id="diff-select" className="select" style={{ width: '100%' }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Questions</label>
              <select id="limit-select" className="select" style={{ width: '100%' }} value={limit} onChange={e => setLimit(Number(e.target.value))}>
                {LIMITS.map(l => <option key={l} value={l}>{l} questions</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card" style={{ maxWidth: 'unset', cursor: 'pointer', transition: 'border-color 0.2s', borderColor: 'var(--border)' }}
              onClick={() => start('practice')} id="practice-card"
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Practice Mode</h3>
              <p className="text-muted">Immediate feedback after each answer. Great for learning.</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>Start Practice</button>
            </div>
            <div className="card" style={{ maxWidth: 'unset', cursor: 'pointer', transition: 'border-color 0.2s', borderColor: 'var(--border)' }}
              onClick={() => start('test')} id="test-card"
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#eab308')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Timed Test</h3>
              <p className="text-muted">10-minute timer. Submit all at once. Simulates real exams.</p>
              <button className="btn btn-sm" style={{ marginTop: '1rem', background: 'rgba(234,179,8,0.15)', color: 'var(--yellow)', border: '1px solid var(--yellow)' }}>Start Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

interface ResultItem {
  _id: string;
  score: number;
  total: number;
  accuracy: number;
  category: string;
  difficulty: string;
  mode: string;
  timeTaken: number;
  createdAt: string;
}

const History: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/test/history').then(({ data }) => { setResults(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="page"><p className="text-muted">Loading history…</p></div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page" style={{ justifyContent: 'flex-start', paddingTop: '2.5rem' }}>
        <div className="card card-xl" style={{ maxWidth: '860px' }}>
          <h1 className="title">📊 Test History</h1>
          <p className="subtitle">Your last 20 sessions</p>

          {!results.length ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p className="text-muted">No tests completed yet.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem', width: 'auto' }} onClick={() => navigate('/')}>Start Practising</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Mode</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const mins = Math.floor(r.timeTaken / 60);
                    const secs = r.timeTaken % 60;
                    return (
                      <tr key={r._id}>
                        <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{fmt(r.createdAt)}</td>
                        <td><span className={`badge badge-${r.category.toLowerCase()}`}>{r.category}</span></td>
                        <td><span className={`badge badge-${r.difficulty}`}>{r.difficulty}</span></td>
                        <td><span className={`badge ${r.mode === 'test' ? 'badge-medium' : ''}`} style={r.mode === 'practice' ? { background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' } : {}}>{r.mode}</span></td>
                        <td style={{ fontWeight: 700 }}>{r.score}/{r.total}</td>
                        <td style={{ fontWeight: 700, color: r.accuracy >= 60 ? 'var(--green)' : 'var(--red)' }}>{r.accuracy}%</td>
                        <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{mins}m {secs}s</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: 'auto' }} onClick={() => navigate('/')}>← Back</button>
        </div>
      </div>
    </div>
  );
};

export default History;

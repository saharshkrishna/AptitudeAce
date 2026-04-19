import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: string;
}

const Practice: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const category = params.get('category') || 'All';
  const difficulty = params.get('difficulty') || 'All';
  const limit = params.get('limit') || '10';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qParams: Record<string, string> = { limit };
        if (category !== 'All') qParams.category = category;
        if (difficulty !== 'All') qParams.difficulty = difficulty;
        const { data } = await api.get('/questions', { params: qParams });
        if (!data.length) { setError('No questions found for these filters.'); setLoading(false); return; }
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
      } catch { setError('Failed to load questions.'); }
      finally { setLoading(false); }
    };
    fetchQuestions();
  }, []);

  const q = questions[current];
  const total = questions.length;
  const progress = total > 0 ? ((current + (revealed ? 1 : 0)) / total) * 100 : 0;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === q.correctIndex) setScore(s => s + 1);
    const updated = [...answers]; updated[current] = selected;
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (current < total - 1) {
      setCurrent(c => c + 1); setSelected(null); setRevealed(false);
    } else {
      // submit
      try {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const { data } = await api.post('/test/submit', {
          questionIds: questions.map(q => q._id),
          answers,
          category, difficulty, mode: 'practice', timeTaken,
        });
        navigate('/result', { state: { result: data } });
      } catch { alert('Failed to submit results.'); }
    }
  };

  if (loading) return <div className="page"><p className="text-muted">Loading questions…</p></div>;
  if (error) return <div className="page"><div className="card"><p style={{ color: 'var(--red)' }}>{error}</p><button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Go Home</button></div></div>;

  const diffClass = `badge badge-${q?.difficulty}`;
  const catClass = `badge badge-${q?.category?.toLowerCase()}`;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
        <div className="card card-wide">
          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--muted)' }}>Q {current + 1} / {total}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={catClass}>{q?.category}</span>
              <span className={diffClass}>{q?.difficulty}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="progress-bar" style={{ marginBottom: '1.5rem' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Score pill */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--green)', fontWeight: 600 }}>✓ {score} correct</span>
          </div>

          {/* Question */}
          <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.6 }}>{q?.text}</p>

          {/* Options */}
          {q?.options.map((opt, idx) => {
            let cls = 'option';
            if (revealed) {
              if (idx === q.correctIndex) cls += ' correct';
              else if (idx === selected && selected !== q.correctIndex) cls += ' wrong';
            } else if (idx === selected) cls += ' selected';
            return (
              <button key={idx} className={cls} disabled={revealed} onClick={() => handleSelect(idx)}>
                <span style={{ fontWeight: 600, marginRight: '0.5rem', color: 'var(--muted)' }}>{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}

          {/* Explanation */}
          {revealed && (
            <div className="explanation-box">
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Explanation: </span>
              {q?.explanation}
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            {!revealed ? (
              <button className="btn btn-primary" onClick={handleReveal} disabled={selected === null}>
                Check Answer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                {current < total - 1 ? 'Next Question →' : 'See Results'}
              </button>
            )}
            <button className="btn btn-outline" style={{ width: 'auto' }} onClick={() => navigate('/')}>Quit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;

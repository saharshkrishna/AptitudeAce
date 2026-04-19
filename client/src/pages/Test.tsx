import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import Timer from '../components/Timer';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: string;
}

const TEST_DURATION = 600; // 10 minutes

const Test: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const category = params.get('category') || 'All';
  const difficulty = params.get('difficulty') || 'All';
  const limit = params.get('limit') || '10';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qParams: Record<string, string> = { limit };
        if (category !== 'All') qParams.category = category;
        if (difficulty !== 'All') qParams.difficulty = difficulty;
        const { data } = await api.get('/questions', { params: qParams });
        if (!data.length) { setError('No questions found.'); setLoading(false); return; }
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
        setTimerRunning(true);
      } catch { setError('Failed to load questions.'); }
      finally { setLoading(false); }
    };
    fetchQuestions();
  }, []);

  const q = questions[current];
  const total = questions.length;
  const answered = answers.filter(a => a !== null).length;

  const selectAnswer = (idx: number) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const submit = async () => {
    setTimerRunning(false);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const { data } = await api.post('/test/submit', {
        questionIds: questions.map(q => q._id),
        answers,
        category, difficulty, mode: 'test', timeTaken,
      });
      navigate('/result', { state: { result: data } });
    } catch { alert('Submission failed. Please try again.'); }
  };

  if (loading) return <div className="page"><p className="text-muted">Loading questions…</p></div>;
  if (error) return <div className="page"><div className="card"><p style={{ color: 'var(--red)' }}>{error}</p><button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Go Home</button></div></div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
        <div className="card card-wide">
          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--muted)' }}>Q {current + 1} / {total}</span>
              <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>{answered}/{total} answered</span>
            </div>
            <Timer durationSeconds={TEST_DURATION} onExpire={submit} running={timerRunning} />
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{
                  width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                  background: i === current ? 'var(--accent)' : answers[i] !== null ? 'rgba(34,197,94,0.3)' : 'var(--surface2)',
                  color: i === current ? '#fff' : answers[i] !== null ? 'var(--green)' : 'var(--muted)',
                }}>
                {i + 1}
              </button>
            ))}
          </div>

          {/* Category / difficulty badges */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className={`badge badge-${q?.category?.toLowerCase()}`}>{q?.category}</span>
            <span className={`badge badge-${q?.difficulty}`}>{q?.difficulty}</span>
          </div>

          {/* Question */}
          <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.6 }}>{q?.text}</p>

          {/* Options */}
          {q?.options.map((opt, idx) => (
            <button key={idx}
              className={`option ${answers[current] === idx ? 'selected' : ''}`}
              onClick={() => selectAnswer(idx)}>
              <span style={{ fontWeight: 600, marginRight: '0.5rem', color: 'var(--muted)' }}>{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}

          {/* Navigation */}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>← Prev</button>
              <button className="btn btn-outline btn-sm" disabled={current === total - 1} onClick={() => setCurrent(c => c + 1)}>Next →</button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={submit}
              style={{ background: answered === total ? 'var(--green)' : undefined }}>
              Submit Test ({answered}/{total})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;

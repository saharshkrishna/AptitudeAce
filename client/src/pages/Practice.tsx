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
        if (!data.length) {
          setError('No questions found for these filters.');
          setLoading(false);
          return;
        }
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
      } catch {
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
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
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (current < total - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      try {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const { data } = await api.post('/test/submit', {
          questionIds: questions.map(q => q._id),
          answers,
          category,
          difficulty,
          mode: 'practice',
          timeTaken,
        });
        navigate('/result', { state: { result: data } });
      } catch {
        alert('Failed to submit results.');
      }
    }
  };

  if (loading) return <div className="page"><p>Loading questions…</p></div>;
  if (error) return (
    <div className="page">
      <p>{error}</p>
      <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  const isCorrect = revealed && selected === q.correctIndex;
  const isWrong = revealed && selected !== q.correctIndex;

  return (
    <div className="practice-page">
      {/* ── Header bar ── */}
      <div className="practice-header">
        <div className="practice-meta">
          <span className="practice-counter">Q {current + 1} / {total}</span>
          <span className={`badge badge-${q?.category?.toLowerCase()}`}>{q?.category}</span>
          <span className={`badge badge-${q?.difficulty}`}>{q?.difficulty}</span>
        </div>
        <div className="flex items-center" style={{ gap: '1rem' }}>
          <span className="score-pill">✓ {score} correct</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>Quit</button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="practice-progress">
        <div className="progress-bar" style={{ width: '100%' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Split screen body ── */}
      <div className="practice-split">
        {/* LEFT: Question + Options */}
        <section className="practice-left">
          <p className="practice-question">{q?.text}</p>

          <div className="practice-options">
            {q?.options.map((opt, idx) => {
              let cls = 'option';
              if (revealed) {
                if (idx === q.correctIndex) cls += ' correct';
                else if (idx === selected && selected !== q.correctIndex) cls += ' wrong';
              } else if (idx === selected) cls += ' selected';
              return (
                <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                  <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="practice-actions">
            {!revealed ? (
              <button
                className="btn btn-primary"
                onClick={handleReveal}
                disabled={selected === null}
              >
                Check Answer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                {current < total - 1 ? 'Next Question →' : 'See Results'}
              </button>
            )}
          </div>
        </section>

        {/* RIGHT: Explanation panel */}
        <aside className="practice-right">
          <div className={`explanation-panel ${
            !revealed ? 'explanation-idle' : isCorrect ? 'explanation-correct' : 'explanation-wrong'
          }`}>
            {!revealed ? (
              <div className="explanation-idle-content">
                <span className="explanation-icon">💡</span>
                <p className="explanation-hint">Answer the question to see the explanation</p>
              </div>
            ) : (
              <>
                <div className="explanation-status">
                  {isCorrect ? (
                    <span className="explanation-correct-badge">✓ Correct!</span>
                  ) : (
                    <span className="explanation-wrong-badge">✗ Incorrect</span>
                  )}
                  {isWrong && (
                    <p className="explanation-correct-answer">
                      Correct answer: <strong>{q.options[q.correctIndex]}</strong>
                    </p>
                  )}
                </div>
                <div className="explanation-divider" />
                <div className="explanation-body">
                  <p className="explanation-label">📚 Explanation</p>
                  <p className="explanation-text">{q?.explanation}</p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Practice;

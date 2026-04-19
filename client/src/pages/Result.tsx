import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface QuestionResult {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  selected: number | null;
  isCorrect: boolean;
}

interface ResultData {
  score: number;
  total: number;
  accuracy: number;
  timeTaken: number;
  questions: QuestionResult[];
}

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as ResultData | undefined;

  if (!result) {
    navigate('/');
    return null;
  }

  const { score, total, accuracy, timeTaken, questions } = result;
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const wrong = total - score;

  const grade = accuracy >= 80 ? { label: 'Excellent! 🎉', color: 'var(--green)' }
    : accuracy >= 60 ? { label: 'Good Job! 👍', color: '#a5b4fc' }
    : { label: 'Keep Practising 💪', color: 'var(--yellow)' };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
        <div className="card card-xl" style={{ maxWidth: '800px' }}>
          {/* Grade */}
          <h1 className="title text-center" style={{ color: grade.color }}>{grade.label}</h1>
          <p className="text-muted text-center" style={{ marginBottom: '1.5rem' }}>Here's how you did</p>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value stat-accent">{score}/{total}</div>
              <div className="stat-label">Score</div>
            </div>
            <div className="stat-card">
              <div className={`stat-value ${accuracy >= 60 ? 'stat-green' : 'stat-red'}`}>{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-green">{score}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-red">{wrong}</div>
              <div className="stat-label">Wrong</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--muted)' }}>{mins}m {secs}s</div>
              <div className="stat-label">Time Taken</div>
            </div>
          </div>

          <hr className="divider" />

          {/* Review */}
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Question Review</h2>
          {questions.map((q, i) => (
            <div key={q._id} className={`review-item ${q.isCorrect ? 'correct-item' : 'wrong-item'}`}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Q{i + 1}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: q.isCorrect ? 'var(--green)' : 'var(--red)' }}>
                  {q.isCorrect ? '✓ Correct' : '✗ Wrong'}
                </span>
              </div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{q.text}</p>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {q.selected !== null && !q.isCorrect && (
                  <p style={{ color: 'var(--red)', marginBottom: '0.25rem' }}>
                    Your answer: {String.fromCharCode(65 + q.selected)}. {q.options[q.selected]}
                  </p>
                )}
                <p style={{ color: 'var(--green)' }}>
                  Correct: {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                </p>
              </div>
              <div className="explanation-box">{q.explanation}</div>
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Practice Again</button>
            <button className="btn btn-outline" onClick={() => navigate('/history')}>View History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

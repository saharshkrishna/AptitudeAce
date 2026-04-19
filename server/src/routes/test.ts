import { Router, Response } from 'express';
import Question from '../models/Question';
import Result from '../models/Result';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/test/submit
// body: { questionIds, answers: number[], category, difficulty, mode, timeTaken }
router.post('/submit', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { questionIds, answers, category, difficulty, mode, timeTaken = 0 } = req.body;
    if (!questionIds || !answers || questionIds.length !== answers.length) {
      res.status(400).json({ message: 'Invalid payload' });
      return;
    }

    const questions = await Question.find({ _id: { $in: questionIds } });
    // preserve order
    const qMap = new Map(questions.map((q) => [String(q._id), q]));

    let score = 0;
    const answerDetails = questionIds.map((id: string, idx: number) => {
      const q = qMap.get(id);
      if (!q) return null;
      const isCorrect = answers[idx] === q.correctIndex;
      if (isCorrect) score++;
      return {
        questionId: id,
        selected: answers[idx] ?? null,
        correct: q.correctIndex,
        isCorrect,
      };
    }).filter(Boolean);

    const total = questionIds.length;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

    const result = await Result.create({
      userId: req.userId,
      score,
      total,
      accuracy,
      category: category || 'All',
      difficulty: difficulty || 'All',
      mode,
      answers: answerDetails,
      timeTaken,
    });

    // Return enriched questions for review
    const enriched = questionIds.map((id: string, idx: number) => {
      const q = qMap.get(id);
      return {
        _id: id,
        text: q?.text,
        options: q?.options,
        correctIndex: q?.correctIndex,
        explanation: q?.explanation,
        selected: answers[idx] ?? null,
        isCorrect: answerDetails[idx]?.isCorrect,
      };
    });

    res.json({ resultId: result._id, score, total, accuracy, timeTaken, questions: enriched });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/test/history
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const results = await Result.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-answers');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/test/history/:id
router.get('/history/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await Result.findOne({ _id: req.params.id, userId: req.userId });
    if (!result) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;

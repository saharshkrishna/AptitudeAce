import { Router, Response } from 'express';
import Question from '../models/Question';
import Result from '../models/Result';
import User from '../models/User';
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
        category: q.category,
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

    // Update User Streak
    const user = await User.findById(req.userId);
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      if (lastActive) {
        lastActive.setHours(0, 0, 0, 0);
      }

      if (!lastActive) {
        user.streak = 1;
        user.lastActive = new Date();
      } else {
        const diffTime = Math.abs(today.getTime() - lastActive.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
          user.lastActive = new Date();
        } else if (diffDays > 1) {
          user.streak = 1;
          user.lastActive = new Date();
        }
      }
      await user.save();
    }

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

    res.json({ resultId: result._id, score, total, accuracy, timeTaken, mode, questions: enriched });
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

// GET /api/test/stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const results = await Result.find({ userId: req.userId });

    const categoryStats: Record<string, { total: number; correct: number }> = {};

    results.forEach(result => {
      result.answers.forEach(answer => {
        if (!categoryStats[answer.category]) {
          categoryStats[answer.category] = { total: 0, correct: 0 };
        }
        categoryStats[answer.category].total += 1;
        if (answer.isCorrect) {
          categoryStats[answer.category].correct += 1;
        }
      });
    });

    const strongPoints: string[] = [];
    const weakPoints: string[] = [];

    for (const [category, stats] of Object.entries(categoryStats)) {
      if (stats.total >= 3) { // Ensure there's enough data
        const accuracy = (stats.correct / stats.total) * 100;
        if (accuracy >= 70) {
          strongPoints.push(category);
        } else if (accuracy <= 40) {
          weakPoints.push(category);
        }
      }
    }

    res.json({
      streak: user.streak || 0,
      strongPoints,
      weakPoints,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;

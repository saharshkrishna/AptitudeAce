import { Router, Request, Response } from 'express';
import Question from '../models/Question';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/questions?category=Quant&difficulty=easy&limit=10
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty, limit = '10' } = req.query;
    const filter: Record<string, string> = {};
    if (category && typeof category === 'string') filter.category = category;
    if (difficulty && typeof difficulty === 'string') filter.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: Math.min(parseInt(limit as string, 10), 50) } },
    ]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/questions/:id
router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/questions  (admin seeding)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;

import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswerDetail {
  questionId: string;
  selected: number | null;
  correct: number;
  isCorrect: boolean;
}

export interface IResult extends Document {
  userId: string;
  score: number;
  total: number;
  accuracy: number;
  category: string;
  difficulty: string;
  mode: 'practice' | 'test';
  answers: IAnswerDetail[];
  timeTaken: number; // seconds
  createdAt: Date;
}

const AnswerDetailSchema = new Schema<IAnswerDetail>(
  {
    questionId: { type: String, required: true },
    selected: { type: Number, default: null },
    correct: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const ResultSchema = new Schema<IResult>(
  {
    userId: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    mode: { type: String, enum: ['practice', 'test'], required: true },
    answers: [AnswerDetailSchema],
    timeTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IResult>('Result', ResultSchema);

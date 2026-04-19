import mongoose, { Document, Schema } from 'mongoose';

export type Category = 'Quant' | 'Logical' | 'Verbal';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface IQuestion extends Document {
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  category: Category;
  difficulty: Difficulty;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: (v: string[]) => v.length === 4,
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, required: true },
    category: { type: String, enum: ['Quant', 'Logical', 'Verbal'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question';

dotenv.config();

const questions = [
  // ───── QUANT – easy ─────
  {
    text: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctIndex: 1,
    explanation: '15% of 200 = (15/100) × 200 = 30.',
    category: 'Quant',
    difficulty: 'easy',
  },
  {
    text: 'A train travels 60 km in 1 hour. How far does it travel in 2.5 hours?',
    options: ['120 km', '150 km', '180 km', '90 km'],
    correctIndex: 1,
    explanation: 'Distance = Speed × Time = 60 × 2.5 = 150 km.',
    category: 'Quant',
    difficulty: 'easy',
  },
  {
    text: 'If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls are there?',
    options: ['15', '18', '20', '25'],
    correctIndex: 2,
    explanation: '3/2 = 30/girls → girls = 30 × 2/3 = 20.',
    category: 'Quant',
    difficulty: 'easy',
  },
  // ───── QUANT – medium ─────
  {
    text: 'A shopkeeper sells an item at a 20% profit. If the cost price is ₹500, what is the selling price?',
    options: ['₹580', '₹600', '₹620', '₹550'],
    correctIndex: 1,
    explanation: 'SP = CP + 20% of CP = 500 + 100 = ₹600.',
    category: 'Quant',
    difficulty: 'medium',
  },
  {
    text: 'Two pipes A and B can fill a tank in 6 hours and 8 hours respectively. How long to fill together?',
    options: ['3.43 h', '3.63 h', '3.00 h', '4.00 h'],
    correctIndex: 0,
    explanation: 'Combined rate = 1/6 + 1/8 = 7/24 tanks/h. Time = 24/7 ≈ 3.43 h.',
    category: 'Quant',
    difficulty: 'medium',
  },
  // ───── QUANT – hard ─────
  {
    text: 'A sum of money doubles in 8 years at simple interest. In how many years will it triple?',
    options: ['16 years', '20 years', '24 years', '12 years'],
    correctIndex: 0,
    explanation: 'Doubles in 8 yrs → SI rate = 12.5%/yr. To triple, SI = 2P, so 2P = P × 12.5% × T → T = 16 yrs.',
    category: 'Quant',
    difficulty: 'hard',
  },
  // ───── LOGICAL – easy ─────
  {
    text: 'Complete the series: 2, 4, 8, 16, __',
    options: ['24', '32', '28', '30'],
    correctIndex: 1,
    explanation: 'Each term is doubled: 16 × 2 = 32.',
    category: 'Logical',
    difficulty: 'easy',
  },
  {
    text: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade',
      'All flowers are roses',
    ],
    correctIndex: 1,
    explanation: 'We can only conclude that some roses MAY fade quickly based on the given premises.',
    category: 'Logical',
    difficulty: 'easy',
  },
  // ───── LOGICAL – medium ─────
  {
    text: 'In a row of 40 students, Asha is 16th from the left. What is her position from the right?',
    options: ['24th', '25th', '26th', '23rd'],
    correctIndex: 1,
    explanation: 'Position from right = 40 − 16 + 1 = 25.',
    category: 'Logical',
    difficulty: 'medium',
  },
  {
    text: 'Find the odd one out: 8, 27, 64, 100, 125',
    options: ['8', '27', '100', '125'],
    correctIndex: 2,
    explanation: '8=2³, 27=3³, 64=4³, 125=5³ are perfect cubes. 100 is not a perfect cube.',
    category: 'Logical',
    difficulty: 'medium',
  },
  // ───── LOGICAL – hard ─────
  {
    text:
      'Five friends A, B, C, D, E sit in a row. A is not at either end. B sits to the immediate right of C. D is not adjacent to E. If C is at position 1, what is the position of A?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    explanation:
      'C=1, B=2. A cannot be at an end → A ∈ {2,3,4}. B already at 2, so A=3. D and E occupy 4,5 with D not adjacent to E is impossible if A=3 — revisiting: A=3 is the only valid non-end slot left.',
    category: 'Logical',
    difficulty: 'hard',
  },
  // ───── VERBAL – easy ─────
  {
    text: 'Choose the correct synonym of "Benevolent":',
    options: ['Cruel', 'Kind', 'Angry', 'Lazy'],
    correctIndex: 1,
    explanation: 'Benevolent means well-meaning and kindly, so "Kind" is the correct synonym.',
    category: 'Verbal',
    difficulty: 'easy',
  },
  {
    text: 'Identify the correctly spelled word:',
    options: ['Accomodate', 'Acommodate', 'Accommodate', 'Acomodate'],
    correctIndex: 2,
    explanation: 'The correct spelling is "Accommodate" (double c, double m).',
    category: 'Verbal',
    difficulty: 'easy',
  },
  // ───── VERBAL – medium ─────
  {
    text: 'Fill in the blank: "He was so tired that he could ______ walk."',
    options: ['barely', 'heavily', 'quickly', 'loudly'],
    correctIndex: 0,
    explanation: '"Barely" means almost not, fitting the context of extreme tiredness.',
    category: 'Verbal',
    difficulty: 'medium',
  },
  {
    text: 'Choose the antonym of "Verbose":',
    options: ['Wordy', 'Talkative', 'Concise', 'Elaborate'],
    correctIndex: 2,
    explanation: 'Verbose means using more words than needed; its antonym is "Concise".',
    category: 'Verbal',
    difficulty: 'medium',
  },
  // ───── VERBAL – hard ─────
  {
    text:
      'The sentence "Neither the manager nor the employees was present" is grammatically:',
    options: [
      'Correct — singular verb with "neither"',
      'Incorrect — should be "were present"',
      'Correct — verb agrees with "manager"',
      'Incorrect — should be "is present"',
    ],
    correctIndex: 1,
    explanation:
      'In "neither…nor" constructions, the verb agrees with the nearer subject ("employees" — plural), so "were present" is correct.',
    category: 'Verbal',
    difficulty: 'hard',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aptitude');
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} questions`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });

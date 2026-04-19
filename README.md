# AptitudeAce — Aptitude Practice Web App

A full-stack aptitude practice app with React + TypeScript, Tailwind CSS, Node.js/Express, and MongoDB.

## Features
- 📚 **Practice Mode** — question-by-question with instant feedback & explanations
- ⏱️ **Timed Test Mode** — 10-minute countdown, submit all at once
- 🏷️ Categories: **Quant · Logical · Verbal**
- 🎯 Difficulty: **easy · medium · hard**
- 📊 Score, accuracy, time taken after each session
- 🗂️ History of last 20 results

## Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (bcryptjs) |

## Prerequisites
- Node.js ≥ 18
- MongoDB running locally on `mongodb://localhost:27017`

## Run Instructions

### 1. Start MongoDB
```bash
mongod   # or use MongoDB Compass / Atlas
```

### 2. Start Backend
```bash
cd server
npm run dev
```
Server runs at **http://localhost:5000**

### 3. Seed Sample Questions (first time only)
```bash
cd server
npm run seed
```

### 4. Start Frontend
```bash
cd client
npm run dev
```
App opens at **http://localhost:5173**

## Folder Structure
```
Aptitude/
├── server/
│   ├── src/
│   │   ├── index.ts          # Express entry
│   │   ├── middleware/auth.ts # JWT middleware
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Question.ts
│   │   │   └── Result.ts
│   │   └── routes/
│   │       ├── auth.ts
│   │       ├── questions.ts
│   │       └── test.ts
│   ├── seed.ts               # Sample question seeder
│   └── .env
└── client/
    └── src/
        ├── api/client.ts     # Axios + JWT interceptor
        ├── context/AuthContext.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   └── Timer.tsx
        └── pages/
            ├── Login.tsx
            ├── Register.tsx
            ├── Home.tsx
            ├── Practice.tsx
            ├── Test.tsx
            ├── Result.tsx
            └── History.tsx
```

## API Reference
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/questions` | ✅ | Get random questions |
| POST | `/api/test/submit` | ✅ | Submit answers, get score |
| GET | `/api/test/history` | ✅ | Past results |

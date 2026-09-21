import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import serverless from 'serverless-http';

import pool from './db.js';
import { configurePassport } from './config/passport.js';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // Supports both AWS Amplify and Vercel frontend URLs
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- SESSION CONFIGURATION ---
const PgSessionStore = pgSession(session);

app.use(session({
  store: new PgSessionStore({
    pool: pool,         
    tableName: 'session', 
    createTableIfMissing: false
  }),
  secret: process.env.SESSION_SECRET || 'pennywise_secret_key',
  resave: false,
  saveUninitialized: false,
  proxy: true, 
  cookie: { 
    secure: true, 
    sameSite: 'none', 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// --- PASSPORT MIDDLEWARE ---
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// --- MOUNT ROUTERS ---
app.use(authRoutes);
app.use(expenseRoutes);
app.use(userRoutes);
app.use(aiRoutes);

// --- LOCAL DEV SERVER ---
if (process.env.NODE_ENV !== 'production' && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// --- DUAL EXPORTS FOR AWS LAMBDA & VERCEL ---

// 1. AWS Lambda Handler (Used by Serverless Framework)
export const handler = serverless(app);

// 2. Default Express Export (Used by Vercel & Node)
export default app;
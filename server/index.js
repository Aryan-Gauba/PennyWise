import express from 'express';
import cors from 'cors';
import pool from './db.js';
import OpenAI from "openai";
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true
}));
app.use(express.json());

// 1. Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'pennywise_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- PASSPORT SERIALIZATION ---
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// --- AUTH STRATEGIES ---

// A. Local Strategy (Username/Password)
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = res.rows[0];

    if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// B. Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;

      let res = await pool.query("SELECT * FROM users WHERE google_id = $1 OR email = $2", [googleId, email]);
      
      if (res.rows.length > 0) {
        return done(null, res.rows[0]);
      } else {
        const newUser = await pool.query(
          "INSERT INTO users (username, google_id, email) VALUES ($1, $2, $3) RETURNING *",
          [profile.displayName, googleId, email]
        );
        return done(null, newUser.rows[0]);
      }
    } catch (err) {
      return done(err);
    }
  }
));

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clears the session cookie
      res.json({ message: "Logged out" });
    });
  });
});

// --- AUTH ROUTES ---

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Username already exists" });
  }
});

app.post("/api/login", passport.authenticate('local'), (req, res) => {
  res.json({ message: "Logged in successfully", user: req.user.username });
});

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/auth/google/callback", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('http://localhost:5173/') 
);

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
};

// --- AI ADVICE ROUTE (Now Protected) ---

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/ai-advice", isAuthenticated, async (req, res) => {
  try {
    const { expenses, prompt } = req.body; 
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are PennyWise, a witty Indian financial advisor. Use ₹ symbol and Indian numbering.` 
        },
        { role: "user", content: `User Question: ${prompt}\n\nData: ${JSON.stringify(expenses)}` },
      ],
      model: "llama-3.3-70b-versatile", 
    });
    res.json({ advice: chatCompletion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ advice: "Offline." });
  }
});

// --- EXPENSE ROUTES (Now filtered by user_id) ---

app.post("/api/expenses", isAuthenticated, async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;
        const finalDate = date || new Date().toISOString().split('T')[0];

        const newExpense = await pool.query(
            "INSERT INTO expenses (description, amount, category, date, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [description, amount, category, finalDate, req.user.id] // user_id from session
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/expenses", isAuthenticated, async (req, res) => {
    try {
        const { date } = req.query;
        let queryText = "SELECT * FROM expenses WHERE user_id = $1"; // Only current user's data
        let values = [req.user.id];

        if (date && date !== "undefined") {
            queryText += " AND date = $2 ORDER BY id ASC";
            values.push(date);
        } else {
            queryText += " ORDER BY date DESC";
        }

        const allExpenses = await pool.query(queryText, values);
        res.json(allExpenses.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.delete("/api/expenses/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    // Check user_id to ensure they can only delete their own
    await pool.query("DELETE FROM expenses WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    res.json("Expense deleted!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
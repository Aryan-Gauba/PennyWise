import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = express.Router();

router.post("/api/register", async (req, res) => {
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

router.post("/api/login", passport.authenticate('local'), (req, res) => {
  res.json({ message: "Logged in successfully", user: req.user.username });
});

router.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out" });
    });
  });
});

router.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/auth/google/callback", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/') 
);

export default router;
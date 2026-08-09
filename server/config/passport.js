// config/passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Adjust path if needed

export const configurePassport = () => {
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
  // A. Local Strategy
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
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
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
};
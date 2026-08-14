import express from 'express';
import pool from '../db.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/api/user/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await pool.query("SELECT monthly_income, annual_income, monthly_budget FROM users WHERE id = $1", [req.user.id]);
    res.json(user.rows[0] || { monthly_income: 0, annual_income: 0, monthly_budget: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile dataset." });
  }
});

router.post("/api/user/update-income", isAuthenticated, async (req, res) => {
  try {
    const { monthlyIncome, annualIncome, monthlyBudget } = req.body;
    
    const monthly = parseFloat(monthlyIncome) || 0;
    const annual = monthly * 12;
    const budget = parseFloat(monthlyBudget) || 0; 

    await pool.query(
      "UPDATE users SET monthly_income = $1, annual_income = $2, monthly_budget = $3 WHERE id = $4",
      [monthly, annual, budget, req.user.id] 
    );

    res.json({ 
      message: "Income updated successfully!", 
      monthly_income: monthly, 
      annual_income: annual,
      monthly_budget: budget 
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update income." });
  }
});

export default router;
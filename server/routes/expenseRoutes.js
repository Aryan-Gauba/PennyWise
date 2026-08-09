import express from 'express';
import pool from '../db.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/api/expenses", isAuthenticated, async (req, res) => {
    try {
        const { description, amount, category, date } = req.body;
        const finalDate = date || new Date().toISOString().split('T')[0];

        const newExpense = await pool.query(
            "INSERT INTO expenses (description, amount, category, date, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [description, amount, category, finalDate, req.user.id]
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/expenses", isAuthenticated, async (req, res) => {
    try {
        const { date } = req.query;
        let queryText = "SELECT * FROM expenses WHERE user_id = $1";
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

router.delete("/api/expenses/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM expenses WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    res.json("Expense deleted!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
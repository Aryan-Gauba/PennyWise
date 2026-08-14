import express from 'express';
import pool from '../db.js';
import OpenAI from "openai";
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/api/ai-advice", isAuthenticated, async (req, res) => {
  try {
    const { expenses, prompt } = req.body; 

    const userRes = await pool.query("SELECT monthly_income, annual_income FROM users WHERE id = $1", [req.user.id]);
    const { monthly_income, annual_income } = userRes.rows[0] || { monthly_income: 0, annual_income: 0 };

    const financialData = {
      monthlyIncome: monthly_income,
      annualIncome: annual_income,
      totalExpensesTracked: expenses.length,
      expensesList: expenses
    };

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are PennyWise, a sharp and crisp Indian financial advisor. You will receive a JSON packet containing the user's tracked expenses AND their monthly/annual income. Analyze their actual savings rate, critique discretionary habits against their real income using a strict 50/30/20 target breakdown, and provide highly actionable, short bulleted financial advice in Rupees (₹). DO NOT output any internal thinking process, chain-of-thought, metadata checklists, or <think> tags.` 
        },
        { role: "user", content: `User Question: ${prompt}\n\nFinancial Packet Data: ${JSON.stringify(financialData)}` },
      ],
      model: process.env.AI_MODEL || "gpt-oss-120b",
    });
    const rawText = chatCompletion.choices[0].message.content;

    const cleanText = rawText.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();

    res.json({ advice: cleanText });
  } catch (err) {
    res.status(500).json({ advice: "Offline." });
  }
});

export default router;
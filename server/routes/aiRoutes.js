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

    // 1. Fetch monthly_budget along with incomes from the database
    const userRes = await pool.query("SELECT monthly_income, annual_income, monthly_budget FROM users WHERE id = $1", [req.user.id]);
    const { monthly_income, annual_income, monthly_budget } = userRes.rows[0] || { monthly_income: 0, annual_income: 0, monthly_budget: 0 };

    // 2. Include monthlyBudget in the financial data packet sent to the AI
    const financialData = {
      monthlyIncome: monthly_income,
      annualIncome: annual_income,
      monthlyBudget: monthly_budget,
      totalExpensesTracked: expenses.length,
      expensesList: expenses
    };

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are PennyWise, a sharp and crisp Indian financial advisor. You will receive a JSON packet containing the user's tracked expenses, monthly/annual income, AND their set monthly budget. Analyze their actual savings rate, compare their total expenses against their specific monthly budget cap, critique habits using a strict 50/30/20 target breakdown, and provide highly actionable, short bulleted financial advice in Rupees (₹). DO NOT output any internal thinking process, chain-of-thought, metadata checklists, or <think> tags.` 
        },
        { role: "user", content: `User Question: ${prompt}\n\nFinancial Packet Data: ${JSON.stringify(financialData)}` },
      ],
      model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
    });
    
    const rawText = chatCompletion.choices[0].message.content;
    const cleanText = rawText.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '').trim();

    res.json({ advice: cleanText });
  } catch (err) {
    res.status(500).json({ advice: "Offline." });
  }
});

export default router;
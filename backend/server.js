
// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

// gemini api service
const {getCategoryFromDescription, getFinancialAnalysis} = require('./services/geminiService')

// App Config
const app = express();
const port = process.env.PORT || 5001;

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middlewares
app.use(express.json()); // To parse JSON bodies
app.use(cors());         // To allow cross-origin requests

// DB Config
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));


// API Routes

// GET all transactions (newest first)
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// POST a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, notes } = req.body;

    const category = await getCategoryFromDescription(description);

    const newTransaction = await Transaction.create({ description, amount, category, notes });

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// DELETE a transaction
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, error: 'No transaction found' });
        }
        await transaction.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// budget routes
// get all budgets
app.get('/api/budgets', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Post is either create or update a budget
app.post('/api/budgets', async (req, res) => {
    try {
        const {category, amount } = req.body;

        // find one and update with upsert true will update if exists or create if doesnt
        const budget = await Budget.findOneAndUpdate(
            { category: category },
            { amount: amount },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Post using AI for suggestions for budgets
app.post('/api/budgets/suggest', async (req, res) => {
    try {
        const { category, transactions } = req.body;
        const expenses = transactions.filter(t => t.category === category && t.amount < 0);

        if (expenses.length === 0) {
            return res.json({ suggestion: `No spending history for ${category}. Set a budget manually to start!` });
        }

        const totalSpent = expenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

        const prompt = `Based on a user's total spending of $${totalSpent.toFixed(2)} in the "${category}" category last month, suggest a single, realistic but challenging monthly budget amount. The goal is to encourage saving. Respond with only a brief sentence and the suggested number, like: "A good starting point could be $450."`;

        const result = await genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }).generateContent(prompt);
        const suggestion = (await result.response).text();

        res.status(200).json({ suggestion });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// budgets charts draw out
app.get('/api/dashboard-data', async (req, res) => {
    try {
        // 1. Spending per category (for the Donut Chart)
        const spendingByCategory = await Transaction.aggregate([
            { $match: { amount: { $lt: 0 } } }, // Only expenses
            { $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }},
            { $project: {
                    _id: 0,
                    category: '$_id',
                    total: { $abs: '$total' }
                }}
        ]);

        // 2. Income vs. Expenses (for the Bar Chart)
        const incomeVsExpense = await Transaction.aggregate([
            { $group: {
                    _id: null,
                    totalIncome: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } },
                    totalExpenses: { $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] } }
                }},
            { $project: {
                    _id: 0,
                    income: '$totalIncome',
                    expenses: { $abs: '$totalExpenses' }
                }}
        ]);

        res.status(200).json({
            spendingByCategory,
            incomeVsExpense: incomeVsExpense[0] || { income: 0, expenses: 0 }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// added the new analysis route
app.post('/api/analysis', async (req, res) => {
    try {
        const { transactions } = req.body;
        if (!transactions || transactions.length === 0) {
            return res.status(400).json({ success: false, error: 'No transactions provided for analysis.' });
        }
        const analysisResult = await getFinancialAnalysis(transactions);
        res.status(200).json({ success: true, analysis: analysisResult });
    } catch (error) {
        // Now we send a more specific error message back to the frontend
        console.error("Full error object:", error);
        res.status(500).json({
            success: false,
            error: 'Failed to communicate with the AI service.',
            details: error.message // Pass the actual error message
        });
    }
});

// Listener
app.listen(port, () => console.log(`Server is running on port: ${port}`));
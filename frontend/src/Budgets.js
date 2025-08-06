import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BUDGET_API_URL = 'http://localhost:5001/api/budgets';

// These should be the same as your backend categories, excluding "Income"
const EXPENSE_CATEGORIES = [
    'Food & Dining', 'Groceries', 'Transportation', 'Housing & Utilities',
    'Shopping', 'Entertainment', 'Health & Wellness', 'Other'
];

function Budgets({ transactions }) {
    const [budgets, setBudgets] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [amount, setAmount] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState('');

    const fetchBudgets = async () => {
        const response = await axios.get(BUDGET_API_URL);
        const budgetsData = response.data.reduce((acc, budget) => {
            acc[budget.category] = budget.amount;
            return acc;
        }, {});
        setBudgets(budgetsData);
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSetBudget = async (e) => {
        e.preventDefault();
        await axios.post(BUDGET_API_URL, { category: selectedCategory, amount: parseFloat(amount) });
        setAmount('');
        fetchBudgets(); // Refresh budget list
    };

    const handleGetSuggestion = async () => {
        setAiSuggestion('Getting suggestion...');
        const response = await axios.post(`${BUDGET_API_URL}/suggest`, { category: selectedCategory, transactions });
        setAiSuggestion(response.data.suggestion);
    };

    const getCategorySpending = (category) => {
        return transactions
            .filter(t => t.category === category && t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    };

    return (
        <div className="budgets-container">
            <h3>Set Your Monthly Budgets</h3>
            <form onSubmit={handleSetBudget} className="budget-form">
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter budget amount"
                    required
                />
                <button type="submit">Set Budget</button>
            </form>
            <div className="ai-suggestion">
                <button onClick={handleGetSuggestion}>Get AI Suggestion for {selectedCategory}</button>
                {aiSuggestion && <p>{aiSuggestion}</p>}
            </div>

            <h4>Your Current Budgets:</h4>
            <ul className="budget-list">
                {Object.entries(budgets).map(([category, budgetAmount]) => {
                    const spent = getCategorySpending(category);
                    const progress = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
                    const isOverBudget = progress > 100;

                    return (
                        <li key={category}>
                            <div className="budget-info">
                                <strong>{category}</strong>
                                <span>Spent: ${spent.toFixed(2)} / Budget: ${budgetAmount.toFixed(2)}</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className={`progress-bar ${isOverBudget ? 'over-budget' : ''}`}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                            </div>
                            {isOverBudget && <small className="over-budget-warning">You're over budget!</small>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Budgets;
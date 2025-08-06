import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Budgets from './Budgets';
import FinancialAnalysis from './FinancialAnalysis';
import './App.css';

// Define the backend API endpoint for transactions
const API_URL = 'http://localhost:5001/api/transactions';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    // Function to fetch all transactions from the backend
    const fetchTransactions = async () => {
        try {
            const response = await axios.get(API_URL);
            setTransactions(response.data); // Update the state with the fetched data
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // useEffect hook to run fetchTransactions() once when the component first loads
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Handler for form submission to add a new transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!description || !amount) {
            alert('Please enter both description and amount.');
            return;
        }

        try {
            // Send the new transaction to the backend
            await axios.post(API_URL, { description, amount: parseFloat(amount) });

            // Clear the form fields after successful submission
            setDescription('');
            setAmount('');

            // Refresh the list of transactions to show the new one
            fetchTransactions();
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    // Handler for deleting a transaction
    const handleDeleteTransaction = async (id) => {
        // Show a confirmation dialog before deleting
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                // Refresh the list after deleting
                fetchTransactions();
            } catch (error) {
                console.error("Error deleting transaction:", error);
            }
        }
    }

    // Calculate the total balance from the transactions state
    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    return (
        <div className="container">
            <h1>Intelligent Financial Tracker</h1>

            {/* The Dashboard with charts */}
            <Dashboard />

            {/* The main balance display */}
            <div className="balance">
                <h2>Your Balance: <span className={totalBalance >= 0 ? 'positive' : 'negative'}>${totalBalance.toFixed(2)}</span></h2>
            </div>

            {/* The Budgets component */}
            <Budgets transactions={transactions} />

            {/* The AI Financial Coach component */}
            <FinancialAnalysis transactions={transactions} />

            {/* The form for adding a new transaction */}
            <h3>Add New Transaction</h3>
            <form onSubmit={handleAddTransaction} className="transaction-form">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (negative for expense)..."
                />
                <button type="submit">Add Transaction</button>
            </form>

            {/* The list of past transactions */}
            <h3>History</h3>
            <ul className="transaction-list">
                {transactions.map((transaction) => (
                    <li key={transaction._id} className={transaction.amount < 0 ? 'expense' : 'income'}>
                        <div className="transaction-details">
                            <span>{transaction.description}</span>
                            <small className="category-tag">{transaction.category}</small>
                        </div>
                        <span>{transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}</span>
                        <button onClick={() => handleDeleteTransaction(transaction._id)} className="delete-btn">x</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
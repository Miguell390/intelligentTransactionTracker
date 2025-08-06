// financial analysis using gemini api

import React, {useState} from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ANALYSIS_API_URL = 'http://localhost:5001/api/analysis';

function FinancialAnalysis({ transactions }) {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyzeSpending = async () => {
        // Filter for expenses only, as they are most relevant for a spending analysis
        const expenses = transactions.filter(t => t.amount < 0);

        if (expenses.length === 0) {
            setError("You don't have any expenses to analyze yet. Add some first!");
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysis('');

        try {
            const response = await axios.post(ANALYSIS_API_URL, { transactions: expenses });
            setAnalysis(response.data.analysis);
        } catch (err) {
            setError('Failed to get analysis. Please try again later.');
            console.error('Analysis error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="analysis-container">
            <h3>AI Financial Coach</h3>
            <p>Get personalized insights on your spending habits.</p>
            <button onClick={handleAnalyzeSpending} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze My Spending'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {analysis && (
                <div className="analysis-result">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default FinancialAnalysis;
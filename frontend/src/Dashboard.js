import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DASHBOARD_API_URL = 'http://localhost:5001/api/dashboard-data';

function Dashboard() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(DASHBOARD_API_URL);
                const { spendingByCategory, incomeVsExpense } = response.data;

                const doughnutChart = {
                    labels: spendingByCategory.map(d => d.category),
                    datasets: [{
                        data: spendingByCategory.map(d => d.total),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    }]
                };

                const barChart = {
                    labels: ['Financial Summary'],
                    datasets: [
                        { label: 'Income', data: [incomeVsExpense.income], backgroundColor: '#2ecc71' },
                        { label: 'Expenses', data: [incomeVsExpense.expenses], backgroundColor: '#e74c3c' }
                    ]
                };

                setChartData({ doughnut: doughnutChart, bar: barChart });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []); // Run once on component mount

    if (!chartData) return <p>Loading dashboard...</p>;

    return (
        <div className="dashboard-container">
            <div className="chart-wrapper">
                <h3>Spending by Category</h3>
                <Doughnut data={chartData.doughnut} />
            </div>
            <div className="chart-wrapper">
                <h3>Income vs. Expenses</h3>
                <Bar data={chartData.bar} />
            </div>
        </div>
    );
}

export default Dashboard;
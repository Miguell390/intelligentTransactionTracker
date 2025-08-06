// backend/services/geminiService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Define the categories your app will use
const CATEGORIES = [
    'Food & Dining',
    'Groceries',
    'Transportation',
    'Housing & Utilities',
    'Shopping',
    'Entertainment',
    'Health & Wellness',
    'Income',
    'Other',
];

//function to get category from gemini
async function getCategoryFromDescription(description) {
    const prompt = `Based on the transaction description "${description}", categorize it into one of the following: ${CATEGORIES.join(', ')}. Respond with only the category name.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let category = response.text().trim();

        // Validate if the category from Gemini is one of our predefined categories
        if (CATEGORIES.includes(category)) {
            return category;
        } else {
            // If Gemini returns something unexpected, default to 'Other'
            console.warn(`Gemini returned an unexpected category: "${category}". Defaulting to "Other".`);
            return 'Other';
        }
    } catch (error) {
        console.error('Error with Gemini API:', error);
        // If there's an API error, default to 'Other'
        return 'Other';
    }
}

// function to get analysis from gemini
async function getFinancialAnalysis(transactions) {
    const prompt = `
    Act as a friendly and helpful financial coach. Based on the following list of transactions, provide a brief analysis of the user's spending habits for the period.
    
    Transactions:
    ${transactions.map(t => `- ${t.description}: $${t.amount.toFixed(2)}`).join('\n')}
    
    Your analysis should:
    1.  Start with a warm and encouraging sentence.
    2.  Identify the top 2-3 spending categories.
    3.  Highlight one specific area where the user could potentially save money, and offer a practical suggestion.
    4.  Keep the entire response concise and easy to read (around 4-6 sentences).
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error with Gemini API for analysis:', error);
        return 'Sorry, I was unable to analyze your spending at this time.';
    }
}


module.exports = { getCategoryFromDescription, getFinancialAnalysis };
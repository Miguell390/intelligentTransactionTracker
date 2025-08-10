# Intelligent Financial Tracker 💸

A full-stack web application that helps you track your expenses and gain financial insights through the power of Google's Gemini AI. This project demonstrates a complete MERN stack application with advanced AI features, designed to be a clean, intuitive, and powerful financial tool.

---

## Application Preview
<img width="975" height="781" alt="image" src="https://github.com/user-attachments/assets/79260426-30e2-4636-be03-10aa8aedb6e3" />


---

##  Core Features

This application is packed with features designed to provide a comprehensive financial overview.

### Standard Features
- **Full CRUD Operations:** Create, Read, Update, and Delete transactions with ease.
- **Interactive Dashboard:** Visualize your financial health with dynamic charts for "Spending by Category" and "Income vs. Expenses".
- **Monthly Filtering:** Easily navigate through your financial history with a dropdown to view transactions by month.
- **Dynamic History View:** Filter your transaction list by "All Spending", "All Income", or any specific spending category for detailed analysis.
- **Clean, Responsive UI:** A modern, collapsible interface that is easy to navigate and works on various screen sizes.

###  AI-Powered Features (Google Gemini API)
- **Automatic Transaction Categorization:** Simply type a description like "Weekly groceries from Walmart" and the Gemini API automatically assigns it to the correct category (e.g., "Groceries").
- **AI Financial Coach:** Get personalized, natural-language insights into your spending habits with the click of a button. Gemini analyzes your data and provides actionable advice.
- **AI Budget Suggestions:** When setting a budget for a category, the AI can analyze your past spending and suggest a realistic starting point.

---

##  Tech Stack

This project was built using the MERN stack and other modern technologies.

| Frontend           | Backend                | Database      | AI Service             |
|--------------------|------------------------|---------------|------------------------|
| **React.js**       | **Node.js**            | **MongoDB**   | **Google Gemini API**  |
| **Axios**          | **Express.js**         | **Mongoose**  |                        |
| **Chart.js**       |                        |               |                        |
| **react-chartjs-2**|                        |               |                        |
| **react-markdown** |                        |               |                        |

---

##  Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (which includes npm)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-github-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set Up Environment Variables:**
    - In the `backend` folder, create a new file named `.env`.
    - You will need two variables: your MongoDB Connection String and your Google Gemini API Key.
    - Add them to the `.env` file like this:
      ```
      MONGO_URI=your_mongodb_connection_string
      GEMINI_API_KEY=your_google_gemini_api_key
      ```
    - **Important:** Your `.env` file should be listed in your `.gitignore` file to keep your keys secret!

### Running the Application

You will need to run the frontend and backend servers in two separate terminals.

1.  **Run the Backend Server:**
    *(In the `backend` directory)*
    ```bash
    npm run dev
    ```
    Your server should now be running on `http://localhost:5001`.

2.  **Run the Frontend Application:**
    *(In the `frontend` directory)*
    ```bash
    npm start
    ```
    Your React application should now be running and open automatically on `http://localhost:3000`

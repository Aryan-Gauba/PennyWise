# 🪙 PennyWise
PennyWise is a full-stack expense tracking application designed to help users manage their finances with ease. It features a modern React frontend, a robust Node.js/Express backend, and integrates AI-driven financial insights to provide personalized spending advice.

## 🚀 Key Features
Full-Stack Architecture: Decoupled Client (Vite + React) and Server (Node + Express).

Secure Authentication: Supports Local (Username/Password) and Google OAuth 2.0 login via Passport.js.

Expense Management: Create, view (filtered by date), and delete expenses seamlessly.

Financial Analytics: Interactive data visualization using Recharts (Line, Bar, and Pie charts).

AI Insights: Get witty, Indian-context financial advice powered by Llama 3 via Groq API.

Relational Database: Persistent data storage using PostgreSQL.

## 🛠️ Tech Stack
### Frontend
Framework: React (Vite)

Styling: Bootstrap 5, Lucide-React

Charts: Recharts

HTTP Client: Axios (with custom interceptors for session handling)

### Backend
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL (pg pool)

Auth: Passport.js (Local & Google Strategies), Express-Session

AI: Groq Cloud SDK (Llama 3.3 70B)

## 📂 Project Structure
Plaintext
```
PennyWise/
├── PennyWise-Client/       # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Analysis, ExpenseForm, etc.)
│   │   ├── Api.js          # Central Axios configuration
│   │   └── App.jsx         # Main routing and Auth logic
└── PennyWise-API/          # Node.js Backend
    ├── db.js               # PostgreSQL connection
    ├── index.js            # Express server and API routes
    └── .env                # Environment variables (Internal)
```
## ⚙️ Installation & Setup
1. Clone the Repository
Bash
git clone https://github.com/your-username/PennyWise.git
cd PennyWise
2. Backend Setup
Bash
cd PennyWise-API
npm install
Create a .env file in the PennyWise-API folder:

Code snippet
PORT=5000
DATABASE_URL=your_postgres_url
SESSION_SECRET=your_secret
GROQ_API_KEY=your_groq_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
Run the server:

Bash
node index.js
3. Frontend Setup
Bash
cd ../PennyWise-Client
npm install
npm run dev
## 🛡️ API Endpoints
Method	Endpoint	Description	Auth Required
POST	/api/register	Register a new user	No
POST	/api/login	Login with credentials	No
GET	/api/expenses	Fetch user expenses (filtered by date)	Yes
POST	/api/expenses	Add a new expense	Yes
POST	/api/ai-advice	Get AI financial insights	Yes
## 📝 Author
Aryan Gauba ECE Undergraduate | Full Stack Developer 

## 📄 License
This project is licensed under the MIT License.

# 🪙 PennyWise
PennyWise is a modern, full-stack expense tracking application designed to help users manage their finances with precision. It features a sleek FinTech dark-mode UI, a modular Node.js/Express backend, persistent PostgreSQL storage, and real-time AI-driven financial insights.

## 🚀 Key Features
* **Modern FinTech UI/UX:** Built with a custom Slate & Emerald dark-mode palette, glassmorphism elements, and fully responsive layouts for mobile, tablet, and desktop.
* **Financial Profile & Budgeting:** Track monthly and annual income alongside a dynamic **Monthly Budget Progress Bar** with real-time color-coded alerts (Safe, Warning, Danger).
* **Secure Authentication:** Supports Local (Username/Password with bcrypt hashing) and Google OAuth 2.0 login via Passport.js and express-session.
* **Expense Management:** Seamlessly add, filter by date, view, and delete daily expenses.
* **Advanced Financial Analytics:** Interactive data visualization using Recharts (Line charts for spending trends, plus Bar and Pie charts with time-frame filters for weekly, monthly, and yearly ranges).
* **AI Financial Coach:** Get sharp, context-aware financial advice powered by Llama 3 via the Groq API, evaluating habits against a strict 50/30/20 budget breakdown.
* **Relational Database:** Persistent data storage using PostgreSQL (Neon) with connection pooling and session caching.

## 🛠️ Tech Stack
### Frontend
* **Framework:** React (Vite)
* **Styling:** Custom CSS Variables, Glassmorphism, Lucide-React / React Icons
* **Charts:** Recharts
* **Routing & State:** React Router DOM, React Context API
* **HTTP Client:** Axios (Centralized API service layer with credentials support)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js (Modular Route/Controller architecture)
* **Database:** PostgreSQL (Neon DB via `pg` pool)
* **Auth:** Passport.js (Local & Google OAuth 2.0 Strategies), Express-Session, Connect-Pg-Simple
* **AI Integration:** Groq Cloud SDK (Llama-3.1-8b-instant)

## 📂 Project Structure
```text
PennyWise/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # UI Components (Analysis, ExpenseForm, Login, etc.)
│   │   ├── context/            # Global State Management (AuthContext)
│   │   ├── services/           # Centralized Axios API service layer
│   │   ├── App.jsx             # Main routing and layout wrapper
│   │   └── App.css             # Custom Design System & FinTech Theme
└── server/                     # Node.js / Express Backend
    ├── config/                 # Passport strategies & configuration
    ├── middleware/             # Route protection middleware
    ├── routes/                 # Modular API routers (auth, expenses, user, AI)
    ├── db.js                   # PostgreSQL connection pool
    └── index.js                # Server entry point
```

## ⚙️ Installation & Setup
1. Clone the Repository
Bash
```
git clone https://github.com/your-username/PennyWise.git
cd PennyWise
```
3. Backend Setup
Bash
```
cd PennyWise-API
npm install
```
Create a .env file in the PennyWise-API folder:

Code snippet
```
PORT=5000
DATABASE_URL=your_postgres_neon_url
SESSION_SECRET=your_session_secret
GROQ_API_KEY=your_groq_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```
Run the server:

Bash
```
node index.js
```
3. Frontend Setup
Bash
```
cd ../PennyWise-Client
npm install
npm run dev
```

## 📝 Author
Aryan Gauba ECE Undergraduate | Full Stack Developer 

## 📄 License
This project is licensed under the MIT License.

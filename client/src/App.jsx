import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { expenseService } from './services/api';
import { useAuth } from './context/AuthContext';
import './App.css';
import Analysis from './components/Analysis';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Footer from './components/Footer';
import About from './components/About';
import Login from './components/Login';

function TrackerPage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [expenses, setExpenses] = useState([]);

  const fetchByDate = async (date) => {
    try {
      const res = await expenseService.getByDate(date);
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchByDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="tracker-page">
      <div className="sidebar-section">
        <div className="expense-form">
          <h3>Add New Expense</h3>
          <ExpenseForm 
            onExpenseAdded={() => fetchByDate(selectedDate)} 
            selectedDate={selectedDate} 
          />
        </div>
      </div>

      <div className="main-section">
        <div className="expense-list-container">
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>
              View Expenses for:
            </label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              style={{ maxWidth: '300px' }}
            />
          </div>
          
          <ExpenseList expenses={expenses} setExpenses={setExpenses} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, loading } = useAuth();
  
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pennywise_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pennywise_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading PennyWise...</div>;

  return (
    <Router>
      <div className="App">
        {/* Pass theme and toggle function to Navbar */}
        <Navbar theme={theme} toggleTheme={toggleTheme} /> 
        
        <div className="container" style={{ flexGrow: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <TrackerPage /> : <Login />} 
            />
            
            <Route 
              path="/analysis" 
              element={isAuthenticated ? <Analysis /> : <Navigate to="/" />} 
            />
            
            <Route path="/about" element={<About />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
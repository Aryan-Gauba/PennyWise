import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Analysis from './components/Analysis';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Footer from './components/Footer';
import About from './components/About';
import Login from './components/Login';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Configure axios globally to handle session cookies
axios.defaults.withCredentials = true;

function TrackerPage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [expenses, setExpenses] = useState([]);

  const fetchByDate = async (date) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/expenses?date=${date}`);
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
      {/* LEFT COLUMN: Data Entry / Forms (400px wide based on CSS) */}
      <div className="sidebar-section">
        <div className="expense-form">
          <h3>Add New Expense</h3>
          <ExpenseForm 
            onExpenseAdded={() => fetchByDate(selectedDate)} 
            selectedDate={selectedDate} 
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Data Viewing / Lists (1fr wide based on CSS) */}
      <div className="main-section">
        <div className="expense-list-container">
          {/* Moved the date selector to sit cleanly above the list */}
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/expenses`);
        if (res.status === 200) setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading PennyWise...</div>;

  return (
    <Router>
      <div className="App">
        <Navbar isAuth={isAuthenticated} setIsAuth={setIsAuthenticated} />
        
        {/* Swapped Bootstrap classes for our custom container */}
        <div className="container" style={{ flexGrow: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <TrackerPage /> : <Login setAuth={setIsAuthenticated} />} 
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
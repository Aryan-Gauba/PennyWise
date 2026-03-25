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
      // Endpoint is now protected on backend
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
      <div className="sidebar-column">
        <div className="date-selector card mb-4">
          <label className="fw-bold mb-2 text-dark">View Expenses for:</label>
          <input 
            type="date" 
            className="form-control"
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </div>
        <ExpenseList expenses={expenses} setExpenses={setExpenses} />
      </div>

      <div className="form-column">
        <div className="card shadow-sm border-0 h-100 p-4">
          <h3 className="mb-4 text-center fw-bold">Add New Expense</h3>
          <ExpenseForm 
            onExpenseAdded={() => fetchByDate(selectedDate)} 
            selectedDate={selectedDate} 
          />
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
        // You might want to create an /api/user endpoint to return req.user
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

  if (loading) return <div className="text-center py-5">Loading PennyWise...</div>;

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar isAuth={isAuthenticated} setIsAuth={setIsAuthenticated} />
        <div className="container py-4 flex-grow-1">
          <Routes>
            {/* If not logged in, show Login for home. If logged in, show Tracker. */}
            <Route 
              path="/" 
              element={isAuthenticated ? <TrackerPage /> : <Login setAuth={setIsAuthenticated} />} 
            />
            
            <Route 
              path="/analysis" 
              element={isAuthenticated ? <Analysis /> : <Navigate to="/" />} 
            />
            
            <Route path="/about" element={<About />} />
            
            {/* Redirect any unknown route to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
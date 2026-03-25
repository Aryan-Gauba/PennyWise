import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Calling the logout route you added to index.js
      await axios.post(`${API_BASE_URL}/api/logout`);
      
      // Update global state in App.jsx
      setIsAuth(false);
      
      // Redirect to the login/home page
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <nav className="navbar">
      <h2>PennyWise</h2>
      <div className="nav-links">
        <Link to="/">Tracker</Link>
        <Link to="/analysis">Analysis</Link>
        <Link to="/about">About</Link>
        
        {/* Only show the logout button if the user is logged in */}
        {isAuth && (
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            style={{
              background: 'transparent',
              border: '1px solid #ff4d4d',
              color: '#ff4d4d',
              marginLeft: '15px',
              padding: '5px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
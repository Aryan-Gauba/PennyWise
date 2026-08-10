import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import our custom hook

const Navbar = () => {
  const navigate = useNavigate();
  // 2. Destructure exactly what we need from context
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // 3. Use the context's logout function
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <nav className="navbar">
      <h2>PennyWise</h2>
      <div className="nav-links">
        {isAuthenticated ? (
          /* 👇 SHOWN WHEN LOGGED IN */
          <>
            <Link to="/">Tracker</Link>
            <Link to="/analysis">Analysis</Link>
            <Link to="/about">About</Link>
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
          </>
        ) : (
          /* 👇 SHOWN WHEN LOGGED OUT (Login & About only) */
          <>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
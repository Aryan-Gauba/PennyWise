import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
          /* 👇 LOGGED IN LINKS */
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
          /* 👇 LOGGED OUT LINKS */
          <>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {/* ☀️/🌙 Always Rightmost Item */}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
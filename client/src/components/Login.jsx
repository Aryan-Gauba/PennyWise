import React, { useState } from 'react';
import { authService, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext'; // 1. Import our custom hook
import { FaGoogle, FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  
  // 2. Destructure the login method from context
  const { login } = useAuth();

  const { username, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await authService.register(formData);
        setIsRegister(false);
        alert("Registration successful! Please login.");
      } else {
        // 3. Use the global login function instead of the setAuth prop
        await login(formData);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  const googleLogin = () => {
    window.open(`${API_BASE_URL}/auth/google`, "_self");
  };

  return (
    <div className="login-container">
      <div className="expense-form login-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your expenses with PennyWise</p>
        </div>

        {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <FaUser style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
            <input 
              type="text" name="username" placeholder="Username" 
              value={username} onChange={onChange} required 
            />
          </div>

          <div className="input-group">
            <FaLock style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
            <input 
              type="password" name="password" placeholder="Password" 
              value={password} onChange={onChange} required 
            />
          </div>

          <button type="submit" style={{ marginTop: '10px' }}>
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={googleLogin} className="google-btn">
          <FaGoogle /> Continue with Google
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '16px' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"} 
          <span 
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: 'var(--primary)', fontWeight: 'bold', marginLeft: '8px', cursor: 'pointer' }}
          >
            {isRegister ? 'Login here' : 'Register now'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
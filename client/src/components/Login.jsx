import React, { useState } from 'react';
import axios from 'axios';
import { FaGoogle, FaLock, FaUser } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = ({ setAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const { username, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/api/register' : '/api/login';
    
    try {
      await axios.post(`${API_BASE_URL}${endpoint}`, formData, { withCredentials: true });
      if (!isRegister) {
        setAuth(true);
      } else {
        setIsRegister(false);
        alert("Registration successful! Please login.");
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
import React, { useState } from 'react';
import { authService, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  
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
        <div className="login-header">
          <h2 className="login-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="login-subtitle">Manage your expenses with PennyWise</p>
        </div>

        {error && <div className="auth-error-box">{error}</div>}

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={username} 
              onChange={onChange} 
              required 
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password} 
              onChange={onChange} 
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn">
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={googleLogin} className="google-btn">
          <FaGoogle /> Continue with Google
        </button>

        <p className="toggle-auth-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => setIsRegister(!isRegister)}
            className="toggle-auth-link"
          >
            {isRegister ? 'Login here' : 'Register now'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
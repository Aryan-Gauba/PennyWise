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
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        withCredentials: true // Crucial for sending/receiving session cookies
      });
      
      if (!isRegister) {
        setAuth(true); // Log the user in on success
      } else {
        setIsRegister(false); // Move to login after successful registration
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
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card login-card shadow-lg border-0 p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-muted small">Manage your expenses with PennyWise</p>
        </div>

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text bg-light border-0"><FaUser className="text-muted" /></span>
            <input 
              type="text" name="username" placeholder="Username" 
              className="form-control bg-light border-0" 
              value={username} onChange={onChange} required 
            />
          </div>

          <div className="input-group mb-4">
            <span className="input-group-text bg-light border-0"><FaLock className="text-muted" /></span>
            <input 
              type="password" name="password" placeholder="Password" 
              className="form-control bg-light border-0" 
              value={password} onChange={onChange} required 
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold py-2 mb-3">
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="divider d-flex align-items-center my-3 text-muted small">
          <hr className="flex-grow-1" /> <span className="mx-2">OR</span> <hr className="flex-grow-1" />
        </div>

        <button onClick={googleLogin} className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-4">
          <FaGoogle /> Continue with Google
        </button>

        <p className="text-center text-muted small mb-0">
          {isRegister ? 'Already have an account?' : "Don't have an account?"} 
          <span 
            className="text-success fw-bold ms-1 cursor-pointer" 
            onClick={() => setIsRegister(!isRegister)}
            style={{ cursor: 'pointer' }}
          >
            {isRegister ? 'Login here' : 'Register now'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
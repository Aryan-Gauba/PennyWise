import axios from 'axios';

// Export this in case we need the raw URL (like for Google OAuth redirects)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create a custom axios instance with our default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving session cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- API Service Objects ---

export const authService = {
  login: (credentials) => api.post('/api/login', credentials),
  register: (userData) => api.post('/api/register', userData),
  logout: () => api.post('/api/logout'),
  checkAuth: () => api.get('/api/current_user') // Acts as our auth check
};

export const expenseService = {
  getAll: () => api.get('/api/expenses'),
  getByDate: (date) => api.get(`/api/expenses?date=${date}`),
  add: (expense) => api.post('/api/expenses', expense),
  delete: (id) => api.delete(`/api/expenses/${id}`)
};

export const userService = {
  getProfile: () => api.get('/api/user/profile'),
  updateIncome: (incomeData) => api.post('/api/user/update-income', incomeData)
};

export const aiService = {
  getAdvice: (data) => api.post('/api/ai-advice', data)
};

export default api;
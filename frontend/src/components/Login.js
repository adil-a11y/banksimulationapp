import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { hashPassword } from '../utils/helpers';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newError = {};
    setLoading(true);

    // Validation
    if (!formData.username.trim()) {
      newError.username = 'Username or email is required';
    }

    if (!formData.password.trim()) {
      newError.password = 'Password is required';
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      setLoading(false);
      return;
    }

    // Check users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user by username or email
    const user = existingUsers.find(
      u => u.username === formData.username || u.email === formData.username
    );

    if (!user) {
      newError.username = 'Invalid credentials';
      setError(newError);
      setLoading(false);
      return;
    }

    // Check password
    const hashedPassword = hashPassword(formData.password);
    if (user.password !== hashedPassword) {
      newError.password = 'Invalid credentials';
      setError(newError);
      setLoading(false);
      return;
    }

    // Login successful
    login(user);
    showNotification('Login successful! Welcome back.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bank Simulation</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username or Email"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username or email"
            error={error.username}
            required
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={error.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

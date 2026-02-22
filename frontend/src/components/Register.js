import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { hashPassword, generateAccountNumber, validateEmail } from '../utils/helpers';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
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
    if (!formData.fullName.trim()) {
      newError.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newError.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newError.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newError.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newError.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      setLoading(false);
      return;
    }

    // Check for existing users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check for duplicate username or email
    const duplicateUser = existingUsers.find(
      user => user.username === formData.username || user.email === formData.email
    );

    if (duplicateUser) {
      if (duplicateUser.username === formData.username) {
        newError.username = 'Username already exists';
      } else {
        newError.email = 'Email already registered';
      }
      setError(newError);
      setLoading(false);
      return;
    }

    // Generate random balance around 100,000 (between 90,000 and 110,000)
    const randomBalance = Math.floor(Math.random() * 20001) + 90000;

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: hashPassword(formData.password), // Hash the password
      accountNumber: generateAccountNumber(),
      accountType: 'Savings',
      createdAt: new Date().toISOString()
    };

    // Save user to localStorage
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Set initial balance for the new user
    localStorage.setItem(`balance_${newUser.id}`, randomBalance.toString());

    // Auto-login and redirect
    login(newUser);
    showNotification(`Account created successfully! Your initial balance is $${randomBalance.toLocaleString()}. Account Number: ${newUser.accountNumber}`, 'success');
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bank Simulation</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={error.fullName}
            required
          />

          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            error={error.username}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={error.email}
            required
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

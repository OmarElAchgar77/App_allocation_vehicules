import React, { useState, useEffect} from 'react';
import './AuthPage.css';
import apiClient from '../api/apiClient';

import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AuthPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
       apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       setIsAuthenticated(true);
      }
    }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      const formErrors = validateForm();

      if (Object.keys(formErrors).length === 0) {
        if (isLogin) {
          // --- LOGIN LOGIC ---
          // API Endpoint: POST /login 
          apiClient.post('/login', {
              email: formData.email,
              password: formData.password
          }).then(function (response) {

              const token = response.data.token; 
              localStorage.setItem('auth_token', token);
              apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              window.dispatchEvent(new Event('authChange'));
              setIsAuthenticated(true);
              toast.success("Login successful!");
              navigate('/');

              apiClient.get('/my-reservations')
              .then(function (response) {
                console.log(response.data);
              }).catch(function (error) {
                toast.error(`failed'`);
              });
          }).catch(function (error) {
              toast.error(`Login failed! ${error.response?.data?.message || 'Check credentials'}`);
          });

        } else {
          // --- REGISTER LOGIC ---
          // API Endpoint: POST /register 
          apiClient.post('/register', {
              name: formData.name,
              email: formData.email,
              password: formData.password
          }).then(function (response) {
              toast.success(`Registration successful! Please Sign In.`);
              setIsLogin(true); // Switch to login view
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          }).catch(function (error) {
              toast.error(`Registration failed!`);
          });
        }
        setErrors({});
      } else {
        setErrors(formErrors);
      }
    };
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      ...formData,
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="auth-component-container">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-inner">
            <div className="auth-header">
              <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="subtitle">
                {isLogin
                  ? 'Sign in to your account to continue'
                  : 'Fill in your details to create an account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={toggleForm} className="toggle-form-btn">
                  {isLogin ? ' Sign Up' : ' Sign In'}
                </button>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <h2>Secure Authentication</h2>
            <p>
              {isLogin
                ? 'Your data is protected with industry-standard encryption. Sign in to access your personalized dashboard.'
                : 'Join thousands of users who trust us with their data. Registration takes less than a minute.'}
            </p>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h3>Secure</h3>
                  <p>End-to-end encryption</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <h3>Fast</h3>
                  <p>Quick authentication process</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🌐</div>
                <div className="feature-text">
                  <h3>Accessible</h3>
                  <p>Available on all devices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
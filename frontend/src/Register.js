import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpperCase && hasSpecialChar;
  };

  const handleRegister = () => {
    setGeneralError('');
    setEmailError('');
    setPasswordError('');

    if (!username || !email || !password) {
      setGeneralError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 10 characters, include one uppercase letter, and one special character.'
      );
      return;
    }

    onRegister(username, email, password, () => setRegistrationSuccess(true));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {registrationSuccess ? (
          <div className="success-message">
            Registered successfully! Redirecting to login...
          </div>
        ) : (
          <>
            <h2>Register</h2>
            {generalError && <div className="error-message">{generalError}</div>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
            />
            {emailError && <div className="error-message">{emailError}</div>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
            <button onClick={handleRegister}>Register</button>
            <button onClick={() => navigate('/login')}>Back to Login</button>
          </>
        )}
      </div>
    </div>
  );

};

export default Register;

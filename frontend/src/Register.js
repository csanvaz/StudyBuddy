import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUserNameError] = useState(false);
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
    
    let hasError = false;

    if (!username){
      hasError = true;
      setUserNameError(true);
    } else {
      setUserNameError(false);
    }

    if (!email){
      hasError = true;
      setEmailError('Email required');
    }
    else if (!validateEmail(email)){
      hasError = true;
      setEmailError('Please enter a valid email');
    }
    else{
      setEmailError('');
    }

    if (!password){
      hasError = true;
      setPasswordError('Password required');
    }
    else if (!validatePassword(email)){
      hasError = true;
      setPasswordError('Password must be at least 10 characters long, contain an uppercase letter and a special character.');
    }
    else{
      setPasswordError('');
    }

    if (hasError) return;

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
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {setUsername(e.target.value); if (usernameError) setUserNameError(false);}}
              style={{ borderColor: usernameError ? 'red' : '' }}
            />
            {usernameError && <div className="error-message">Username is required</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              style={{ borderColor: emailError ? 'red' : '' }}
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
              style={{ borderColor: passwordError ? 'red' : '' }}
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

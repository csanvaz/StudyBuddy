import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backendURL from './config'; 
import axios from 'axios'; 
import './styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [step, setStep] = useState('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = async () => {
    try {
      const response = await axios.post(`${backendURL}/validate-email`, { email }); 
      if (response.status === 200 && response.data.success) {
        setIsEmailValid(true);
        setEmailError('');
        setStep('reset'); 
      }
    } catch (error) {
      setIsEmailValid(false);
      if (error.response && error.response.status === 404) {
        setEmailError('Email not associated with any account.');
      } else {
        setEmailError('An error occurred while validating the email.');
      }
    }
  };

  const handleEmailSubmit = async () => {
    console.log('Validating email:', email);
    await validateEmail();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(true); 
    setEmailError(''); 
  };

  const handlePasswordReset = () => {
    console.log('Password reset submitted');
    alert('Password changed successfully!');
    navigate('/login');
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {step === 'email' ? (
          <>
            <h2>Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange} // Reset error states on input change
              style={{
                border: isEmailValid ? '1px solid #ccc' : '2px solid red',
              }}
            />
            {!isEmailValid && <p style={{ color: 'red' }}>{emailError}</p>}
            <button onClick={handleEmailSubmit}>
              Send Verification Code
            </button>
          </>
        ) : (
          <>
            <h2>Reset Password</h2>
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordReset}>
              Submit
            </button>
          </>
        )}
        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '10px',
            color: 'blue',
            fontStyle: 'italic',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
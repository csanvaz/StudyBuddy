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
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [codeError, setCodeError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpperCase && hasSpecialCharacter;
  };

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post(`${backendURL}/validate-email`, { email });
      if (response.data.success) {
        setIsEmailValid(true);
        setEmailError('');
        setStep('reset');
      }
    } catch (error) {
      setIsEmailValid(false);
      setEmailError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'An error occurred'
      );
    }
  };

  const handleResetSubmit = async () => {
    let hasError = false;

    // Check verification code
    if (!code) {
      setIsCodeValid(false);
      setCodeError('Verification code is required.');
      hasError = true;
    } else {
      setIsCodeValid(true);
      setCodeError('');
    }

    // Check password requirements
    if (!validatePassword(newPassword)) {
      setPasswordError(
        'Password must be at least 10 characters long, contain one uppercase letter, and one special character (!@#$%^&*(),.?":{}|<>).'
      );
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    try {
      const response = await axios.post(`${backendURL}/verify-reset-code`, { email, code });

      if (response.status === 200 && response.data.success) {
        const resetResponse = await axios.post(`${backendURL}/reset-password`, {
          email,
          newPassword,
        });

        if (resetResponse.status === 200 && resetResponse.data.success) {
          setResetSuccess(true);
          setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } else {
          setPasswordError('Failed to reset password. Please try again.');
        }
      } else {
        setIsCodeValid(false);
        setCodeError('Invalid or expired verification code.');
      }
    } catch (error) {
      if (error.response?.data?.message === 'Invalid or expired code') {
        setIsCodeValid(false);
        setCodeError('Incorrect or expired verification code.');
      } else {
        setPasswordError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {resetSuccess ? (
          <div className="success-message" style={{ color: 'green' }}>
            Password reset successfully! Redirecting to login...
          </div>
        ) : (
          <>
            {step === 'email' && (
              <>
                <h2>Forgot Password</h2>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailValid(true);
                    setEmailError('');
                  }}
                  style={{
                    borderColor: isEmailValid ? '' : 'red',
                  }}
                />
                {emailError && <div className="error-message">{emailError}</div>}
                <button onClick={handleEmailSubmit}>Send Verification Code</button>
              </>
            )}
            {step === 'reset' && (
              <>
                <h2>Reset Password</h2>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setIsCodeValid(true);
                    setCodeError('');
                  }}
                  style={{
                    borderColor: isCodeValid ? '' : 'red',
                  }}
                />
                {codeError && <div className="error-message">{codeError}</div>}
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                  }}
                  style={{
                    borderColor: passwordError ? 'red' : '',
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  style={{
                    borderColor: passwordError ? 'red' : '',
                  }}
                />
                {passwordError && <div className="error-message">{passwordError}</div>}
                <button onClick={handleResetSubmit}>Submit</button>
              </>
            )}
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
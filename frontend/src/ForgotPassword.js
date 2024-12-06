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
  const navigate = useNavigate();

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
    try {
      const response = await axios.post(`${backendURL}/verify-reset-code`, { email, code });
      console.log('Verification response:', response.data);

      if (response.status === 200 && response.data.success) {
        setIsCodeValid(true);
        setCodeError('');
      } else {
        setIsCodeValid(false);
        setCodeError('Incorrect or expired verification code.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match.');
        return;
      }

      const resetResponse = await axios.post(`${backendURL}/reset-password`, {
        email,
        newPassword,
      });

      if (resetResponse.status === 200 && resetResponse.data.success) {
        alert('Password reset successful!');
        navigate('/login');
      } else {
        setPasswordError('not this one');
      }
    } catch (error) {
      console.error('Error during reset:', error.response?.data || error.message);
      if (error.response?.data?.message === 'Invalid or expired code') {
        setIsCodeValid(false);
        setCodeError('Incorrect or expired verification code.');
      } else {
        console.log("this?")
        setPasswordError('Failed to reset password.');
      }
    }
  };




  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
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
                border: isEmailValid ? '1px solid #ccc' : '2px solid red',
              }}
            />
            {!isEmailValid && <p style={{ color: 'red' }}>{emailError}</p>}
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
                border: isCodeValid ? '1px solid #ccc' : '2px solid red',
              }}
            />
            {!isCodeValid && <p style={{ color: 'red' }}>{codeError}</p>}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError('');
              }}
              style={{
                border: passwordError ? '2px solid red' : '1px solid #ccc',
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
                border: passwordError ? '2px solid red' : '1px solid #ccc',
              }}
            />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            <button onClick={handleResetSubmit}>Submit</button>
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
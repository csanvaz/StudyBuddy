import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    console.log('Email submitted:', email);
    // Simulate backend response
    setStep('reset');
  };

  const handlePasswordReset = () => {
    console.log('Password reset submitted');
    alert('Password changed successfully!');
    navigate('/login'); // Navigate to login after success
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={() => {
                console.log('Email button clicked');
                handleEmailSubmit();
              }}
            >
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
            <button
              onClick={() => {
                console.log('Submit button clicked');
                handlePasswordReset();
              }}
            >
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

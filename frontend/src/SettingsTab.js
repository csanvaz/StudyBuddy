import React, { useState } from 'react';
import axios from 'axios';
import backendURL from './config';
import './styles/SettingsTab.css';

const SettingsTab = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpperCase && hasSpecialChar;
  };

  const handleChangePassword = async () => {
    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      hasError = true;
    } else {
      setCurrentPasswordError('');
    }

    if (!newPassword) {
      setNewPasswordError('New password is required');
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      setNewPasswordError(
        'Password must be at least 10 characters long, contain an uppercase letter, and a special character.'
      );
      hasError = true;
    } else {
      setNewPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your new password');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('New passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/change-password`, {
        userId,
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setSuccess('Password changed successfully');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data.message || 'Incorrect current password');
        setSuccess('');
      }
    } catch (err) {
      setError('Incorrect current password');
      setSuccess('');
    }
  };

  return (
    <div className="settings-tab">
      <h2>Settings</h2>
      <div className="change-password-section">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (currentPasswordError) setCurrentPasswordError('');
          }}
          style={{ borderColor: currentPasswordError ? 'red' : '' }}
        />
        {currentPasswordError && <div className="error-message">{currentPasswordError}</div>}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (newPasswordError) setNewPasswordError('');
          }}
          style={{ borderColor: newPasswordError ? 'red' : '' }}
        />
        {newPasswordError && <div className="error-message">{newPasswordError}</div>}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          style={{ borderColor: confirmPasswordError ? 'red' : '' }}
        />
        {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
        <button onClick={handleChangePassword}>Change Password</button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

export default SettingsTab;
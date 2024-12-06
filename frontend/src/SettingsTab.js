import React, { useState } from 'react';
import axios from 'axios';
import backendURL from './config';
import './styles/SettingsTab.css';

const SettingsTab = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/change-password`, {
        userId,
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data.message);
        setSuccess('');
      }
    } catch (error) {
      setError('Error changing password');
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
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Change Password</button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
      {/* Add more settings sections here */}
    </div>
  );
};

export default SettingsTab;
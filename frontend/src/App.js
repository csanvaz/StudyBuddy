import React, { useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import multiavatar from '@multiavatar/multiavatar';
import AppContent from './AppContent.js';
import axios from 'axios';

// const backendURL = "http://localhost:8080";
const backendURL = "https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com"

const App = () => {
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");
  const [avatarName, setAvatarName] = useState("default");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  

  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${backendURL}/login`, { username, password });

      if (response.status === 200) {
        const data = response.data;
        setUserName(username);
        setToken(data.token);
        setAvatarName(data.avatar);
        setIsLoggedIn(true);
        setUserId(data.userId);
        navigate('/');
      } else {
        alert(`Login failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      const response = await axios.post(`${backendURL}/register`, { username, email, password });

      if (response.status === 201) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        alert(`Registration failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  const handleAvatarChange = async (avatarName) => {
    try{
      const response = await axios.post(`${backendURL}/update-avatar`, { userId: userId, avatar: avatarName, token: token });
      if (response.status === 200) {
        multiavatar(avatarName);
        setAvatarName(avatarName);
      } else {
        alert(`Avatar update failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error during avatar update:', error);
      alert('An error occurred during avatar update. Please try again.');
    }
  }

  return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route
          path="/"
          element={isLoggedIn ? (
            <AppContent
              userName={userName}
              avatarName={avatarName}
              handleAvatarChange={handleAvatarChange}
              isLoggedIn={isLoggedIn}
              token={token}
              userId={userId}
            />
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
  );
};

export default App;
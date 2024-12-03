import React, { useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import multiavatar from '@multiavatar/multiavatar';
import AppContent from './AppContent.js';
import axios from 'axios';

const backendURL = "http://localhost:8080";
//const backendURL = "https://CS484FinalProjectEnvironment-env.eba-qkbmea2x.us-east-1.elasticbeanstalk.com"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarName, setAvatarName] = useState("default");

  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${backendURL}/login`, { username, password });

      if (response.status === 200) {
        const data = response.data;
        setIsLoggedIn(true);
        setUserName(username);
        setAvatarName(data.avatar);
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

  const handleAvatarChange = () => multiavatar(avatarName);

  return (
    isLoggedIn ? (
      <AppContent
        userName={userName}
        avatarName={avatarName}
        handleAvatarChange={handleAvatarChange}
        setAvatarName={setAvatarName}
      />
    ) : (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister}/>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import {Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  //fetch state from storage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserName = localStorage.getItem('userName');
    const savedAvatarName = localStorage.getItem('avatarName');
    const savedUserId = localStorage.getItem('userId');

    if (savedToken && savedUserName && savedAvatarName && savedUserId) {
      setToken(savedToken);
      setUserName(savedUserName);
      setAvatarName(savedAvatarName);
      setUserId(savedUserId);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

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

        //save state
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', username);
        localStorage.setItem('avatarName', data.avatar);
        localStorage.setItem('userId', data.userId);

        setLoginError('');
        navigate('/');
      } else {
        setLoginError('Invalid credentials, please try again');
      }
    } catch (error) {
      setLoginError('Invalid credentials, please try again');
    }
  };

  const handleRegister = async (username, email, password, onSuccess) => {
    try {
      const response = await axios.post(`${backendURL}/register`, { username, email, password });

      if (response.status === 201) {
        onSuccess();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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

  const handleLogout = () => {
    //clear all state
    setIsLoggedIn(false);
    setUserName('');
    setToken('');
    setAvatarName('default');
    setIsLoggedIn(false);
    setUserId('');
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} loginError={loginError} />} />
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
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
  );
};

export default App;
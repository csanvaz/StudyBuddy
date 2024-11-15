import React, { useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import multiavatar from '@multiavatar/multiavatar';
import AppContent from './AppContent.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarName, setAvatarName] = useState("default");

  const navigate = useNavigate();

  const handleLogin = (username, avatar) => {
    setIsLoggedIn(true);
    setUserName(username);
    setAvatarName(avatar)
    navigate('/');
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
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  );
};

export default App;